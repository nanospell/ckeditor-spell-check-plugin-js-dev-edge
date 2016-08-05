/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: nanospell */

'use strict';

(function() {
	bender.editor = {
		config: {
			enterMode: CKEDITOR.ENTER_P
		}
	};

	bender.test({
		setUp: function () {
			this.server = sinon.fakeServer.create();
			this.server.respondImmediately = true;

			// for these tests we don't really care that much about the
			// mock data, just that it returns something vaguely resembling it
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
		},
		'test it emits events when going through the spellcheck cycle': function () {
			var bot = this.editorBot,
				editor = bot.editor,
				resumeAfter = bender.tools.resumeAfter,
				observer = observeSpellCheckEvents(editor),
				starterHtml,

			starterHtml = '<p>asdf jkl dzxda</p>';

			bot.setData(starterHtml, function () {
				resumeAfter(editor, 'spellCheckComplete', function () {
					observer.assert(["spellCheckComplete", "startMarkTypos", "startCheckWordsAjax", "startScanWords"])
				});

				wait();
			});

		}
	});


	/*
	this pattern is taken from
	https://github.com/ckeditor/ckeditor-dev/blob/12f0de314fd6fbee0bc4d35d541123d283fdecc9/tests/plugins/filetools/fileloader.js#L131
	 */
	function observeSpellCheckEvents( editor ) {
		var observer = { events: [] };

		function stdObserver( evt ) {
			observer.events.push(evt.name);
		}

		editor.on( 'startSpellCheckOn', stdObserver );
		editor.on( 'startScanWords', stdObserver );
		editor.on( 'startCheckWordsAjax', stdObserver );
		editor.on( 'startMarkTypos', stdObserver );
		editor.on( 'spellCheckComplete', stdObserver );

		observer.assert = function( expected ) {
			var events = observer.events;

			assert.areSame( expected.length, events.length,
				'Events and expected length should be the same. Actual events:\n' + observer.events );

			for ( var i = 0; i < events.length; i++ ) {
				assert.areSame( expected[ i ], events[ i ] );
			}
		};

		return observer;
	}

})();
