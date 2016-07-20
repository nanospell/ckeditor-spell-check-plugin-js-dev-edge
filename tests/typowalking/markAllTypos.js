/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: nanospell */

'use strict';

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_P
	}
};

bender.test( {
	assertHtml: function( expected, actual, msg ) {
		assert.areEqual( bender.tools.fixHtml( expected ), bender.tools.fixHtml( actual ), msg );
	},
	setupSpy: function() {
		var editor = this.editorBot.editor,
			markTyposSpy;

		markTyposSpy = sinon.spy(editor.plugins.nanospell, 'markTypos');

		this.spy = markTyposSpy;

		return markTyposSpy;
	},
	getMarkedHtmlBlocksAsText: function() {
		var markTyposArgs = this.spy.args,
			i,
			markedHtml = [];

		for (i = 0; i < markTyposArgs.length; i++) {
			markedHtml.push(markTyposArgs[i][1].getOuterHtml());
		}

		return markedHtml;
	},
	setUp: function() {
		this.setupSpy();
	},
	tearDown: function() {
		this.editorBot.editor.plugins.nanospell.markTypos.restore();
	},
	'test marking a simple paragraph': function() {
		var bot = this.editorBot,
			blocksToBeMarked,
			markedHtml;

		bot.setHtmlWithSelection( '<p>foo bar baz</p>' );

		bot.editor.plugins.nanospell.markAllTypos(bot.editor);

		markedHtml = this.getMarkedHtmlBlocksAsText();

		this.assertHtml('<p>foo bar baz</p>', markedHtml[0]);
	},

	'test marking a simple list': function() {
		var bot = this.editorBot,
			blocksToBeMarked,
			markedHtml;

		bot.setHtmlWithSelection(
			'<ol>' +
				'<li>foo</li>' +
				'<li>bar</li>' +
				'<li>baz</li>' +
			'</ol>'
		);

		bot.editor.plugins.nanospell.markAllTypos(bot.editor);

		markedHtml = this.getMarkedHtmlBlocksAsText();

		this.assertHtml('<li>foo</li>', markedHtml[0]);
		this.assertHtml('<li>bar</li>', markedHtml[1]);
		this.assertHtml('<li>baz</li>', markedHtml[2]);
	},

	'test marking a nested list': function() {
		var bot = this.editorBot,
			blocksToBeMarked,
			markedHtml;

		bot.setHtmlWithSelection(
			'<ul>' +
				'<li>' +
					'<ol>' +
						'<li>foo bar baz</li>' +
					'</ol>' +
				'</li>' +
			'</ul>'
		);

		bot.editor.plugins.nanospell.markAllTypos(bot.editor);

		markedHtml = this.getMarkedHtmlBlocksAsText();

		this.assertHtml('<li>foo bar baz</li>', markedHtml[0]);
	},


	'test marking a nested multi item list': function() {
		var bot = this.editorBot,
			blocksToBeMarked,
			markedHtml;

		bot.setHtmlWithSelection(
			'<ul>' +
				'<li>' +
					'<ol>' +
						'<li>foo</li>' +
						'<li>bar baz</li>' +
					'</ol>' +
				'</li>' +
			'</ul>'
		);

		bot.editor.plugins.nanospell.markAllTypos(bot.editor);

		markedHtml = this.getMarkedHtmlBlocksAsText();

		this.assertHtml('<li>foo</li>', markedHtml[0]);
		this.assertHtml('<li>bar baz</li>', markedHtml[1]);
	},

	'test marking a complex nested list': function() {
		var bot = this.editorBot,
			blocksToBeMarked,
			markedHtml;

		bot.setHtmlWithSelection(
			'<ul>' +
				'<li>fud' +
					'<ol>' +
						'<li>foo</li>' +
						'<li>bar</li>' +
					'</ol>' +
				'bop</li>' +
				'<li>baz</li>' +
			'</ul>' );

		bot.editor.plugins.nanospell.markAllTypos(bot.editor);

		markedHtml = this.getMarkedHtmlBlocksAsText();

		this.assertHtml(
			'<li>fud' +
				'<ol>' +
					'<li>foo</li>' +
					'<li>bar</li>' +
				'</ol>' +
			'bop</li>', markedHtml[0]);
		this.assertHtml('<li>foo</li>', markedHtml[1]);
		this.assertHtml('<li>bar</li>', markedHtml[2]);

		// there is an odd case here (probably because CKEditor doesn't really support
		// text following nested lists very well
		// so one of the blocks is marked with a range twice.
		// this can be fixed later.

		this.assertHtml(
			'<li>fud' +
				'<ol>' +
					'<li>foo</li>' +
					'<li>bar</li>' +
				'</ol>' +
			'bop</li>', markedHtml[3]);
		this.assertHtml('<li>baz</li>', markedHtml[4]);
	},


} );

