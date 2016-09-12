/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: nanospell */

'use strict';

(function () {
	bender.editor = {
		config: {
			enterMode: CKEDITOR.ENTER_P,
			nanospell: {
				autostart: false
			}
		}
	};

	bender.test({
		setUp: function () {
			this.server = sinon.fakeServer.create();
			this.server.respondImmediately = true;

			// for these tests we don't really care that much about the
			// mock data, just that it returns something vaguely resembling the server call
			var suggestions = {
				"result": {
					"asdf": ["abba"],
					"jkl": ["joke"],
					"dzxda": ["dandy", "doody"]
				}
			};

			this.server.respondWith(
				'/spellcheck/nano/',
				JSON.stringify(suggestions)
			);
		},
		tearDown: function () {
			this.server.restore();
			this.editorBot.editor.execCommand('nanospell');
		},
		'test it emits events when going through the spellcheck cycle': function () {
			var bot = this.editorBot,
				editor = bot.editor,
				resumeAfter = bender.tools.resumeAfter,
				observer = observeSpellCheckEvents(editor),
				starterHtml = '<p>asdf jkl dzxda</p>';

			bot.setData(starterHtml, function () {
				resumeAfter(editor, 'spellCheckComplete', function () {
					observer.assert(["spellCheckComplete", "startMarkTypos", "startCheckWordsAjax", "startScanWords"])
				});

				editor.execCommand('nanospell');

				wait();
			});
		},
		'test future spellchecks only check the current element': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				resumeAfter = bender.tools.resumeAfter,
				observer = observeSpellCheckEvents(editor),
				starterHtml = '<p>asdf jkl dzxda psd</p><p>asdf jkl^</p>';

			resumeAfter(editor, 'spellCheckComplete', function () {
				// first run
				observer.assert(["spellCheckComplete", "startMarkTypos", "startCheckWordsAjax", "startScanWords"]);

				// make a new observer to clear the events

				observer = observeSpellCheckEvents(editor);

				// press the spacebar

				editor.editable().fire('keydown', new CKEDITOR.dom.event({
					keyCode: 32,
					ctrlKey: false,
					shiftKey: false
				}));

				resumeAfter(editor, 'spellCheckComplete', function () {
					var secondParagraph = editor.editable().getChild(1);

					// no ajax call required on the second run, since words are repeats.
					observer.assert(["spellCheckComplete", "startMarkTypos", "startScanWords"]);
					observer.assertRootIs(secondParagraph);
				});

				// wait for spellcheck to fire after the spacebar
				wait();

			});

			bot.setHtmlWithSelection(starterHtml);
			editor.execCommand('nanospell');
			wait();
		}
	});


	/*
	 this pattern is taken from
	 https://github.com/ckeditor/ckeditor-dev/blob/12f0de314fd6fbee0bc4d35d541123d283fdecc9/tests/plugins/filetools/fileloader.js#L131
	 */
	function observeSpellCheckEvents(editor) {
		var observer = {events: []};

		function stdObserver(evt) {
			observer.events.push(evt);
		}

		editor.on('startSpellCheckOn', stdObserver);
		editor.on('startScanWords', stdObserver);
		editor.on('startCheckWordsAjax', stdObserver);
		editor.on('startMarkTypos', stdObserver);
		editor.on('spellCheckComplete', stdObserver);

		observer.assert = function (expected) {
			var events = observer.events;

			assert.areSame(expected.length, events.length,
				'Events and expected length should be the same. Actual events:\n' + observer.events);

			for (var i = 0; i < events.length; i++) {
				assert.areSame(expected[i], events[i].name);
			}
		};

		observer.assertRootIs = function (expectedRoot) {
			var events = observer.events,
				event,
				i,
				root;

			for (i=0, event=events[i]; i<events.length; i++) {
				if (event.name === 'spellCheckComplete') {
					continue;
				} else if (event.name === 'startCheckWordsAjax') {
					root = event.data.root;
				} else {
					root = event.data;
				}
				assert.isTrue(root.equals(expectedRoot));
			}
		};

		return observer;
	}

})();
