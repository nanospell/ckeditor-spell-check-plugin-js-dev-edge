/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,nanospell */

// Clean up all instances been created on the page.
function removeAllInstances() {
	var allInstances = CKEDITOR.instances;
	for ( var i in allInstances ) {
		CKEDITOR.remove(  allInstances[ i ] );
	}
}

bender.test( {
	setUp: function() {
		removeAllInstances();
	},

	'test it loads with the plugin enabled': function() {
		CKEDITOR.replace( 'editor1' );
		assert.isObject( CKEDITOR.instances.editor1, 'editor instance not found' );
	},
} );
