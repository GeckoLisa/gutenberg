
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { IconButton } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { URLInput } from '../';

const LinkControlInputSearch = ( {
	value,
	onChange,
	renderSuggestions,
	fetchSuggestions,
	onReset,
} ) => {
	return (
		<form>
			<URLInput
				className="block-editor-link-control__search-input"
				value={ value }
				onChange={ onChange }
				placeholder={ __( 'Search or type url' ) }
				__experimentalRenderSuggestions={ renderSuggestions }
				__experimentalFetchLinkSuggestions={ fetchSuggestions }
				__experimentalHandleURLSuggestions={ true }
			/>

			<IconButton
				disabled={ ! value.length }
				type="reset"
				label={ __( 'Reset' ) }
				icon="no-alt"
				className="block-editor-link-control__search-reset"
				onClick={ onReset }
			/>

		</form>
	);
};

export default LinkControlInputSearch;
