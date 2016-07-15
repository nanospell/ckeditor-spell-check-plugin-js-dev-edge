/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: nanospell */

'use strict';

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_P
	},
};

bender.test( {
	'test walking a simple sentence': function() {
		var bot = this.editorBot,
			editor = bot.editor,
			range,
			wordwalker;

		bot.setHtmlWithSelection( '[<p>foo bar baz</p>]' );

		range = new CKEDITOR.dom.range( editor.document );
		range.selectNodeContents( editor.editable() );

		wordwalker = new editor.plugins.nanospell.WordWalker(range);



	},
} );

