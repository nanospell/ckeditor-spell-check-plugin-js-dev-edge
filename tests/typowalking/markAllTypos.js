/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: nanospell */

'use strict';

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_P
	}
};

bender.test( {
	setupSpy: function() {
		var editor = this.editorBot.editor,
			markTyposSpy;

		markTyposSpy = sinon.spy(editor.plugins.nanospell, 'markTypos');

		this.spy = markTyposSpy;

		return markTyposSpy;
	},

	'test marking a simple paragraph': function() {
		var bot = this.editorBot,
			blocksToBeMarked;

		this.setupSpy();

		bot.setHtmlWithSelection( '<p>foo bar baz</p>' );

		bot.editor.plugins.nanospell.markAllTypos(bot.editor);

		blocksToBeMarked = this.spy.args;

		assert.areEqual('<p>foo bar baz</p>', blocksToBeMarked[0]);


	},


} );

