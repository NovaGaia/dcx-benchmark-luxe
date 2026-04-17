( function () {
	function closeNav( nav, toggle ) {
		toggle.setAttribute( 'aria-expanded', 'false' );
		nav.classList.remove( 'is-open' );
		toggle.focus();
	}

	function initNavInternal() {
		document
			.querySelectorAll( 'nav.wp-block-navigation.is-style-nav-internal' )
			.forEach( function ( nav ) {
				if ( nav.dataset.navInternalInit ) {
					return;
				}
				nav.dataset.navInternalInit = '1';

				const toggle = document.createElement( 'button' );
				toggle.className = 'nav-internal-toggle';
				toggle.setAttribute( 'aria-expanded', 'false' );
				toggle.setAttribute( 'aria-haspopup', 'true' );

				const activeLink =
					nav.querySelector(
						'.current-page-item .wp-block-navigation-item__content'
					) ||
					nav.querySelector(
						'.current-menu-item .wp-block-navigation-item__content'
					) ||
					nav.querySelector(
						'.wp-block-navigation-item__content[aria-current="page"]'
					);

				const firstLink = nav.querySelector(
					'.wp-block-navigation-item__content'
				);
				toggle.textContent =
					activeLink || firstLink
						? ( activeLink || firstLink ).textContent.trim()
						: 'Navigation';

				nav.insertBefore( toggle, nav.firstChild );

				toggle.addEventListener( 'click', function ( e ) {
					e.stopPropagation();
					const expanded =
						this.getAttribute( 'aria-expanded' ) === 'true';
					this.setAttribute( 'aria-expanded', String( ! expanded ) );
					nav.classList.toggle( 'is-open', ! expanded );
				} );

				nav.querySelectorAll(
					'.wp-block-navigation-item__content'
				).forEach( function ( link ) {
					link.addEventListener( 'click', function () {
						toggle.textContent = this.textContent.trim();
						closeNav( nav, toggle );
					} );
				} );

				document.addEventListener( 'keydown', function ( e ) {
					if (
						( e.key === 'Escape' || e.key === 'Esc' ) &&
						nav.classList.contains( 'is-open' )
					) {
						closeNav( nav, toggle );
					}
				} );

				const container = nav.querySelector(
					'.wp-block-navigation__container'
				);
				document.addEventListener(
					'pointerdown',
					function ( e ) {
						if (
							! container.contains( e.target ) &&
							e.target !== toggle &&
							nav.classList.contains( 'is-open' )
						) {
							closeNav( nav, toggle );
						}
					},
					true
				);
			} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initNavInternal );
	} else {
		initNavInternal();
	}
} )();
