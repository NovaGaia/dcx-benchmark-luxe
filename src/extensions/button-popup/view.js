( function () {
	let overlay = null;
	let iframe = null;

	function createOverlay( url ) {
		overlay = document.createElement( 'div' );
		overlay.className = 'dcx-popup-overlay';
		overlay.setAttribute( 'role', 'dialog' );
		overlay.setAttribute( 'aria-modal', 'true' );
		overlay.setAttribute( 'aria-label', 'Formulaire' );

		const container = document.createElement( 'div' );
		container.className = 'dcx-popup-container';

		iframe = document.createElement( 'iframe' );
		iframe.src = url;
		iframe.className = 'dcx-popup-iframe';
		iframe.setAttribute( 'title', 'Formulaire HubSpot' );
		iframe.sandbox =
			'allow-scripts allow-same-origin allow-forms allow-popups';
		container.appendChild( iframe );

		const closeBtn = document.createElement( 'button' );
		closeBtn.className = 'dcx-popup-close';
		closeBtn.setAttribute( 'aria-label', 'Fermer' );
		closeBtn.appendChild( document.createTextNode( '×' ) );
		closeBtn.addEventListener( 'click', closePopup );
		container.appendChild( closeBtn );

		overlay.appendChild( container );
		document.body.appendChild( overlay );
		document.body.classList.add( 'dcx-popup-open' );
	}

	function closePopup() {
		if ( overlay ) {
			document.body.removeChild( overlay );
			overlay = null;
			iframe = null;
		}
		document.body.classList.remove( 'dcx-popup-open' );
	}

	function handleClick( e ) {
		const link = e.target.closest( 'a.has-popup, button.has-popup, div.has-popup' ) || e.target.closest( '[data-popup-url]' );
		if ( ! link ) {
			return;
		}

		const popupUrl = link.getAttribute( 'data-popup-url' );
		if ( ! popupUrl ) {
			return;
		}

		e.preventDefault();
		createOverlay( popupUrl );
	}

	function handleKeydown( e ) {
		if ( e.key === 'Escape' && overlay ) {
			closePopup();
		}
	}

	const buttons = document.querySelectorAll( 'a.has-popup, button.has-popup, div.has-popup, [data-popup-url]' );
	if ( ! buttons.length ) {
		return;
	}

	for ( let i = 0; i < buttons.length; i++ ) {
		buttons[ i ].addEventListener( 'click', handleClick );
	}

	document.addEventListener( 'keydown', handleKeydown );
} )();
