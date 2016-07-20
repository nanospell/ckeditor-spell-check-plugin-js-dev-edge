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
	'test marking a simple table': function() {
		var bot = this.editorBot,
			blocksToBeMarked,
			markedHtml;

		bot.setHtmlWithSelection(
			'<table>' +
			'<tbody>' +
			'<tr>' +
			'<td>cell1</td>' +
			'<td>cell2</td>' +
			'</tr>' +
			'<tr>' +
			'<td>cell3</td>' +
			'<td>cell4</td>' +
			'</tr>' +
			'</tbody>' +
			'</table>'
		);

		bot.editor.plugins.nanospell.markAllTypos(bot.editor);

		markedHtml = this.getMarkedHtmlBlocksAsText();

		this.assertHtml('<td>cell1</td>', markedHtml[0]);
		this.assertHtml('<td>cell2</td>', markedHtml[1]);
		this.assertHtml('<td>cell3</td>', markedHtml[2]);
		this.assertHtml('<td>cell4</td>', markedHtml[3]);
	},
	'test marking a simple table after p conversion': function() {
		var bot = this.editorBot,
			blocksToBeMarked,
			markedHtml;

		bot.setHtmlWithSelection(
			'<table>' +
			'<tbody>' +
			'<tr>' +
			'<td><p>cell1</p></td>' +
			'<td><p>cell2</p></td>' +
			'</tr>' +
			'<tr>' +
			'<td>cell3</td>' +
			'<td>cell4</td>' +
			'</tr>' +
			'</tbody>' +
			'</table>'
		);

		bot.editor.plugins.nanospell.markAllTypos(bot.editor);

		markedHtml = this.getMarkedHtmlBlocksAsText();

		this.assertHtml('<p>cell1</p>', markedHtml[0]);
		this.assertHtml('<p>cell2</p>', markedHtml[1]);
		this.assertHtml('<td>cell3</td>', markedHtml[2]);
		this.assertHtml('<td>cell4</td>', markedHtml[3]);
	},





} );

