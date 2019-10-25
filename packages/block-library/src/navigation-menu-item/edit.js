/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import {
	ExternalLink,
	PanelBody,
	TextareaControl,
	TextControl,
	Toolbar,
	ToggleControl,
	ToolbarButton,
} from '@wordpress/components';
import {
	LEFT,
	RIGHT,
	UP,
	DOWN,
	BACKSPACE,
	ENTER,
} from '@wordpress/keycodes';
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	PlainText,
	LinkControl,
} from '@wordpress/block-editor';
import {
	Fragment,
	useRef,
	useState,
} from '@wordpress/element';

function NavigationMenuItemEdit( {
	attributes,
	isSelected,
	isParentOfSelectedBlock,
	setAttributes,
	fetchSearchSuggestions,
} ) {
	const { label, link } = attributes;
	const plainTextRef = useRef( null );
	const [ isLinkOpen, setIsLinkOpen ] = useState( false );

	const [ currentLink, setLink ] = useState( link );
	const initialLinkSetting = { 'new-tab': link.newTab };
	const [ linkSettings, setLinkSettings ] = useState( initialLinkSetting );

	const handleLinkControlOnKeyDown = ( event ) => {
		const { keyCode } = event;

		if ( [ LEFT, DOWN, RIGHT, UP, BACKSPACE, ENTER ].indexOf( keyCode ) > -1 ) {
			// Stop the key event from propagating up to ObserveTyping.startTypingInTextField.
			event.stopPropagation();
		}
	};

	const closeLinkControl = () => {
		setLinkSettings( initialLinkSetting );
		setIsLinkOpen( false );
	};

	const updateLink = ( link ) => {
		setAttributes( { link } );
		setLink( link );
	};

	const updateLinkSetting = ( setting, value ) => {
		setLinkSettings( {
			...linkSettings,
			[ setting ]: value,
		} );

		const newTab = true;
		setAttributes( { link: { ...link, newTab } } );
	};



	let content;
	if ( isSelected ) {
		content = (
			<div className="wp-block-navigation-menu-item__edit-container">
				<PlainText
					ref={ plainTextRef }
					className="wp-block-navigation-menu-item__field"
					value={ label }
					onChange={ ( labelValue ) => setAttributes( { label: labelValue } ) }
					aria-label={ __( 'Navigation Label' ) }
					maxRows={ 1 }
				/>
			</div>
		);
	} else {
		content = <div className="wp-block-navigation-menu-item__container">
			{ attributes.label }
		</div>;
	}

	return (
		<Fragment>
			<BlockControls>
				<Toolbar>
					<ToolbarButton
						name="link"
						icon="admin-links"
						title={ __( 'Link' ) }
						onClick={ () => setIsLinkOpen( ! isLinkOpen ) }
					/>
					{ isLinkOpen &&
						<LinkControl
							className="wp-block-navigation-menu-item__inline-link-input"
							onKeyDown={ handleLinkControlOnKeyDown }
							onKeyPress={ ( event ) => { event.stopPropagation() } }
							onClose={ closeLinkControl }
							currentLink={ currentLink }
							onLinkChange={ updateLink }
							currentSettings={ linkSettings }
							onSettingsChange={ updateLinkSetting }
							fetchSearchSuggestions={ fetchSearchSuggestions }
						/>
					}
				</Toolbar>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'Menu Settings' ) }
				>
					<ToggleControl
						checked={ attributes.opensInNewTab }
						onChange={ ( opensInNewTab ) => {
							setAttributes( { opensInNewTab } );
						} }
						label={ __( 'Open in new tab' ) }
					/>
					<TextareaControl
						value={ attributes.description || '' }
						onChange={ ( description ) => {
							setAttributes( { description } );
						} }
						label={ __( 'Description' ) }
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'SEO Settings' ) }
				>
					<TextControl
						value={ attributes.title || '' }
						onChange={ ( title ) => {
							setAttributes( { title } );
						} }
						label={ __( 'Title Attribute' ) }
						help={ __( 'Provide more context about where the link goes.' ) }
					/>
					<ToggleControl
						checked={ attributes.nofollow }
						onChange={ ( nofollow ) => {
							setAttributes( { nofollow } );
						} }
						label={ __( 'Add nofollow to menu item' ) }
						help={ (
							<Fragment>
								{ __( 'Don\'t let search engines follow this link.' ) }
								<ExternalLink
									className="wp-block-navigation-menu-item__nofollow-external-link"
									href={ __( 'https://codex.wordpress.org/Nofollow' ) }
								>
									{ __( 'What\'s this?' ) }
								</ExternalLink>
							</Fragment>
						) }
					/>
				</PanelBody>
			</InspectorControls>
			<div className={ classnames(
				'wp-block-navigation-menu-item', {
					'is-editing': isSelected || isParentOfSelectedBlock,
					'is-selected': isSelected,
				} ) }
			>
				{ content }
				{ ( isSelected || isParentOfSelectedBlock ) &&
					<InnerBlocks
						allowedBlocks={ [ 'core/navigation-menu-item' ] }
					/>
				}
			</div>
		</Fragment>
	);
}

export default withSelect( ( select, ownProps ) => {
	const { hasSelectedInnerBlock, getSettings } = select( 'core/block-editor' );
	const { clientId } = ownProps;

	return {
		isParentOfSelectedBlock: hasSelectedInnerBlock( clientId, true ),
		fetchSearchSuggestions: getSettings().__experimentalFetchLinkSuggestions,
	};
} )( NavigationMenuItemEdit );
