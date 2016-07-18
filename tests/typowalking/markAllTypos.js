/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: nanospell */

'use strict';

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_P
	}
};

bender.test( {
	getBlocksToBeMarked: function() {
		var editor = this.editorBot.editor,
			markTyposSpy;

		markTyposSpy = sinon.spy(editor.plugins.nanospell.markTypos);

		editor.plugins.nanospell.markAllTypos(editor);

		return markTyposSpy.args;
	},

	'test marking a simple paragraph': function() {
		var bot = this.editorBot,
			blocksToBeMarked;
		bot.setHtmlWithSelection( '<p>foo bar baz</p>' );

		blocksToBeMarked = this.getBlocksToBeMarked();

		assert.areEqual('<p>foo bar baz</p>', blocksToBeMarked[0]);


	},


} );

