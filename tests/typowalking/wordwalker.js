/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: nanospell */

'use strict';

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_P
	},
};

bender.test( {
	setUp: function() {
		this.editor = this.editorBot.editor;
	},
	getWordsWithWordWalker: function(root) {
		var editor = this.editorBot.editor,
			range,
			wordwalker,
			wordsReturned = [],
			currWordObj;

		range = new CKEDITOR.dom.range( editor.document );
		// assume there is only one block level element.
		range.selectNodeContents( root );

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

		wordsReturned = this.getWordsWithWordWalker(this.editor.editable().getFirst() );

		arrayAssert.itemsAreEqual(['foo', 'bar', 'baz'], wordsReturned);
	},

	'test walking a simple paragraph with inline formats': function() {
		var bot = this.editorBot,
			wordsReturned;
		bot.setHtmlWithSelection( '<p>f<i>o</i>o <strong>b</strong>ar <em>baz</em></p>' );

		wordsReturned = this.getWordsWithWordWalker(this.editor.editable().getFirst() );

		arrayAssert.itemsAreEqual(['foo', 'bar', 'baz'], wordsReturned);
	},

	'test walking a single item list': function() {
		var bot = this.editorBot,
			wordsReturned;
		bot.setHtmlWithSelection(
			'<ol>' +
				'<li>foo bar baz</li>' +
			'</ol>'
		);

		wordsReturned = this.getWordsWithWordWalker(this.editor.editable().getFirst().getFirst() );

		arrayAssert.itemsAreEqual(['foo', 'bar', 'baz'], wordsReturned);
	},

	'test walking multiple list items': function() {
		var bot = this.editorBot,
			wordsReturned,
			list;
		bot.setHtmlWithSelection(
			'<ol>' +
				'<li>foo bar</li>' +
				'<li>bar baz</li>' +
				'<li>baz foo</li>' +
			'</ol>'
		);

		list = this.editor.editable().getFirst();

		arrayAssert.itemsAreEqual(['foo', 'bar'], this.getWordsWithWordWalker( list.getChild(0) ));
		arrayAssert.itemsAreEqual(['bar', 'baz'], this.getWordsWithWordWalker( list.getChild(1) ));
		arrayAssert.itemsAreEqual(['baz', 'foo'], this.getWordsWithWordWalker( list.getChild(2) ));
	},

	'test walking in a double nested list': function() {
		var bot = this.editorBot,
			wordsReturned,
			outerUnorderedList,
			innerOrderedList;
		bot.setHtmlWithSelection(
			'<ul>' +
				'<li>' +
					'<ol>' +
						'<li>foo bar baz</li>' +
					'</ol>' +
				'</li>' +
			'</ul>'
		);

		outerUnorderedList = this.editor.editable().getFirst();

		innerOrderedList = outerUnorderedList.getFirst().getFirst();

		// due to the way that range iterators work, the `li` get passed in.

		// we special-case the walker to not follow into nested blocks
		// because of the special list case where they get passed in twice.
		arrayAssert.itemsAreEqual([], this.getWordsWithWordWalker( outerUnorderedList.getFirst() ));
		arrayAssert.itemsAreEqual(['foo', 'bar', 'baz'], this.getWordsWithWordWalker( innerOrderedList.getFirst() ));
	},

	'test walking across a double nested list': function() {
		var bot = this.editorBot,
			wordsReturned;
		bot.setHtmlWithSelection(
			'<ul>' +
				'<li>foo' +
					'<ol>' +
						'<li>bar baz</li>' +
					'</ol>' +
				'</li>' +
			'</ul>' );

		wordsReturned = this.getWordsWithWordWalker(this.editor.editable().getFirst().getFirst() );

		arrayAssert.itemsAreEqual(['foo'], wordsReturned);
	},

	'test walking nested list wrapped with text nodes': function() {
		var bot = this.editorBot,
			wordsReturned,
			outerUnorderedList,
			innerOrderedList;
		bot.setHtmlWithSelection(
			'<ul>' +
				'<li>foo' +
					'<ol>' +
						'<li>bar</li>' +
					'</ol>' +
				'baz</li>' +
			'</ul>'
		);

		outerUnorderedList = this.editor.editable().getFirst();

		innerOrderedList = outerUnorderedList.getFirst().getChild(1);

		// this is a bug!  but pinning it for later.
		// although we have solved the problem of inner list being walked twice,
		// it's not smart enough yet to realize we need to add a whitespace when skipping over.
		// we need to detect this special case and add a whitespace (harder than it sounds)
		arrayAssert.itemsAreEqual(['foo', 'baz'], this.getWordsWithWordWalker( outerUnorderedList.getFirst() ));
		arrayAssert.itemsAreEqual(['bar'], this.getWordsWithWordWalker( innerOrderedList.getFirst() ));
	},

	'test walking list item which has textnode with table sibling': function() {
		var bot = this.editorBot,
			wordsReturned,
			outerUnorderedList,
			innerOrderedList;
		bot.setHtmlWithSelection(
			'<ul><li>' +
				'asdf' +
				'<table>' +
					'<thead>' +
						'<tr>' +
							'<th>cell1</th>' +
							'<th>cell2</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
						'<tr>' +
							'<td>cell3</td>' +
							'<td>cell4</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' +
			'</li></ul>'
		);

		outerUnorderedList = this.editor.editable().getFirst();

		arrayAssert.itemsAreEqual(['asdf'], this.getWordsWithWordWalker( outerUnorderedList.getFirst() ));
	}
} );

