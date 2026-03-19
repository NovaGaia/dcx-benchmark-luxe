document.querySelectorAll( '.dcx-blurred-section' ).forEach( ( block ) => {
	const openBtn = block.querySelector( '.dcx-blurred-section__open-btn' );
	const modal = block.querySelector( '.dcx-blurred-section__modal' );

	if ( ! openBtn || ! modal ) {
		return;
	}

	// Déplacer la modal vers body pour échapper aux stacking contexts
	document.body.appendChild( modal );

	const closeBtn = modal.querySelector( '.dcx-blurred-section__modal-close' );
	const modalOverlay = modal.querySelector(
		'.dcx-blurred-section__modal-overlay'
	);

	function openModal() {
		modal.hidden = false;
		document.body.style.overflow = 'hidden';
		if ( closeBtn ) {
			closeBtn.focus();
		}
	}

	function closeModal() {
		modal.hidden = true;
		document.body.style.overflow = '';
		openBtn.focus();
	}

	openBtn.addEventListener( 'click', openModal );
	if ( closeBtn ) {
		closeBtn.addEventListener( 'click', closeModal );
	}
	if ( modalOverlay ) {
		modalOverlay.addEventListener( 'click', closeModal );
	}

	document.addEventListener( 'keydown', ( e ) => {
		if ( e.key === 'Escape' && ! modal.hidden ) {
			closeModal();
		}
	} );
} );
