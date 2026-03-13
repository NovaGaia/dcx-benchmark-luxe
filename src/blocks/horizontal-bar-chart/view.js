import {
	Chart,
	BarController,
	PieController,
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Tooltip,
	Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(
	BarController,
	PieController,
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Tooltip,
	Legend,
	ChartDataLabels
);

function initCharts() {
	document.querySelectorAll( '.dcx-bar-chart' ).forEach( ( block ) => {
		const canvas = block.querySelector( '.dcx-bar-chart__canvas' );
		if ( ! canvas || canvas.dataset.chartInitialized ) {
			return;
		}
		canvas.dataset.chartInitialized = '1';

		let data;
		try {
			data = JSON.parse( canvas.dataset.chart );
		} catch {
			return;
		}

		const colors = data.colors ?? [];
		const isPie = data.type === 'pie';
		const suffix = data.valueSuffix ?? '%';
		const fmt = ( v ) => v + suffix;

		const config = isPie
			? {
					type: 'pie',
					data: {
						labels: data.labels,
						datasets: [
							{
								data: data.values,
								backgroundColor: colors,
								borderWidth: 0,
							},
						],
					},
					options: {
						responsive: true,
						maintainAspectRatio: true,
						aspectRatio: 1.5,
						plugins: {
							legend: { display: false },
							tooltip: {
								callbacks: {
									label: ( ctx ) =>
										` ${ ctx.label }: ${ fmt( ctx.parsed ) }`,
								},
							},
							datalabels: {
								color: '#fff',
								formatter: fmt,
								font: { weight: 'bold', size: 15 },
								display: ( ctx ) =>
									ctx.dataset.data[ ctx.dataIndex ] >= 5,
							},
						},
					},
			  }
			: {
					type: 'bar',
					data: {
						labels: data.labels,
						datasets: [
							{
								data: data.values,
								backgroundColor: colors,
								borderWidth: 0,
								borderRadius: { topRight: 6, bottomRight: 6 },
								maxBarThickness: 24,
							},
						],
					},
					options: {
						indexAxis: 'y',
						responsive: true,
						plugins: {
							legend: { display: false },
							tooltip: {
								callbacks: {
									label: ( ctx ) =>
										` ${ fmt( ctx.parsed.x ) }`,
								},
							},
							datalabels: {
								anchor: 'end',
								align: 'end',
								formatter: fmt,
								font: { weight: 'bold' },
							},
						},
						scales: {
							x: {
								beginAtZero: true,
								max: data.xMax ?? 100,
								ticks: {
									callback: fmt,
								},
							},
						},
					},
			  };

		new Chart( canvas, config ); // eslint-disable-line no-new

		// Modal
		const btn = block.querySelector( '.dcx-bar-chart__insight-btn' );
		const modal = btn
			? document.getElementById( btn.getAttribute( 'aria-controls' ) )
			: null;
		if ( ! btn || ! modal ) {
			return;
		}

		// Move modal to body to escape any parent stacking context
		canvas.ownerDocument.body.appendChild( modal );

		const closeBtn = modal.querySelector( '.dcx-bar-chart__modal-close' );
		const overlay = modal.querySelector( '.dcx-bar-chart__modal-overlay' );
		const ownerDoc = canvas.ownerDocument;

		function openModal() {
			modal.removeAttribute( 'hidden' );
			btn.setAttribute( 'aria-expanded', 'true' );
			if ( closeBtn ) {
				closeBtn.focus();
			}
			trapFocus( modal, ownerDoc );
		}

		function closeModal() {
			modal.setAttribute( 'hidden', '' );
			btn.setAttribute( 'aria-expanded', 'false' );
			btn.focus();
		}

		btn.addEventListener( 'click', openModal );

		if ( closeBtn ) {
			closeBtn.addEventListener( 'click', closeModal );
		}

		if ( overlay ) {
			overlay.addEventListener( 'click', closeModal );
		}

		ownerDoc.addEventListener( 'keydown', ( e ) => {
			if ( e.key === 'Escape' && ! modal.hasAttribute( 'hidden' ) ) {
				closeModal();
			}
		} );
	} );
}

function trapFocus( element, ownerDoc ) {
	const focusableSelectors =
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
	const focusable = Array.from(
		element.querySelectorAll( focusableSelectors )
	).filter( ( el ) => ! el.hasAttribute( 'disabled' ) );

	if ( focusable.length === 0 ) {
		return;
	}

	const first = focusable[ 0 ];
	const last = focusable[ focusable.length - 1 ];

	function handleTab( e ) {
		if ( e.key !== 'Tab' ) {
			return;
		}
		if ( element.hasAttribute( 'hidden' ) ) {
			ownerDoc.removeEventListener( 'keydown', handleTab );
			return;
		}
		if ( e.shiftKey ) {
			if ( ownerDoc.activeElement === first ) {
				e.preventDefault();
				last.focus();
			}
		} else if ( ownerDoc.activeElement === last ) {
			e.preventDefault();
			first.focus();
		}
	}

	ownerDoc.addEventListener( 'keydown', handleTab );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initCharts );
} else {
	initCharts();
}
