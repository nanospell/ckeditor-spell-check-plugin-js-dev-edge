/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: nanospell */

'use strict';

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_P
	},
};

bender.test( {
	getWordsInEditorWithWordWalker: function() {
		var editor = this.editorBot.editor,
			range,
			wordwalker,
			wordsReturned = [],
			currWordObj;

		range = new CKEDITOR.dom.range( editor.document );
		range.selectNodeContents( editor.editable() );

		wordwalker = new editor.plugins.nanospell.WordWalker(range);

		while (currWordObj = wordwalker.getNextWord()) {
			wordsReturned.push(currWordObj.word);
		}

		return wordsReturned;
	},

	'test walking a simple paragraph': function() {
		var bot = this.editorBot,
			wordsReturned;
		bot.setHtmlWithSelection( '<p>foo bar baz</p>' );

		wordsReturned = this.getWordsInEditorWithWordWalker();

		arrayAssert.itemsAreEqual(['foo', 'bar', 'baz'], wordsReturned);
	},

	'test walking a simple paragraph with inline formats': function() {
		var bot = this.editorBot,
			wordsReturned;
		bot.setHtmlWithSelection( '<p>f<i>o</i>o <strong>b</strong>ar <em>baz</em></p>' );

		wordsReturned = this.getWordsInEditorWithWordWalker();

		arrayAssert.itemsAreEqual(['foo', 'bar', 'baz'], wordsReturned);
	},

	'test walking a single item list': function() {
		var bot = this.editorBot,
			wordsReturned;
		bot.setHtmlWithSelection( '<ol><li>foo bar baz</li></ol>' );

		wordsReturned = this.getWordsInEditorWithWordWalker();

		arrayAssert.itemsAreEqual(['foo', 'bar', 'baz'], wordsReturned);
	},

	'test walking multiple list items': function() {
		var bot = this.editorBot,
			wordsReturned;
		bot.setHtmlWithSelection( '<ol><li>foo</li><li>bar</li><li>baz</li></ol>' );

		wordsReturned = this.getWordsInEditorWithWordWalker();

		arrayAssert.itemsAreEqual(['foo', 'bar', 'baz'], wordsReturned);
	},

	'test walking in a double nested list': function() {
		var bot = this.editorBot,
			wordsReturned;
		bot.setHtmlWithSelection( '<ul><li><ol><li>foo bar baz</li></ol></li></ul>' );

		wordsReturned = this.getWordsInEditorWithWordWalker();

		arrayAssert.itemsAreEqual(['foo', 'bar', 'baz'], wordsReturned);
	},

	'test walking across a double nested list': function() {
		var bot = this.editorBot,
			wordsReturned;
		bot.setHtmlWithSelection( '<ul><li>foo<ol><li>bar baz</li></ol></li></ul>' );

		wordsReturned = this.getWordsInEditorWithWordWalker();

		arrayAssert.itemsAreEqual(['foo', 'bar', 'baz'], wordsReturned);
	}


} );

