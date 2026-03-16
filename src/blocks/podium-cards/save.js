import { useBlockProps, RichText } from '@wordpress/block-editor';

const CARDS = [
	{ rank: 2, medal: '🥈', label: '2ème', modifier: '2nd' },
	{ rank: 1, medal: '🥇', label: '1ère', modifier: '1st' },
	{ rank: 3, medal: '🥉', label: '3ème', modifier: '3rd' },
];

export default function save( { attributes } ) {
	const {
		name1,
		score1,
		description1,
		name2,
		score2,
		description2,
		name3,
		score3,
		description3,
	} = attributes;

	const values = {
		1: { name: name1, score: score1, description: description1 },
		2: { name: name2, score: score2, description: description2 },
		3: { name: name3, score: score3, description: description3 },
	};

	const blockProps = useBlockProps.save( { className: 'dcx-podium' } );

	return (
		<div { ...blockProps }>
			{ CARDS.map( ( { rank, medal, label, modifier } ) => (
				<div
					key={ rank }
					className={ `dcx-podium__card dcx-podium__card--${ modifier }` }
				>
					<span className="dcx-podium__medal">{ medal }</span>
					<span className="dcx-podium__rank">{ label }</span>
					<RichText.Content
						tagName="strong"
						className="dcx-podium__name"
						value={ values[ rank ].name }
					/>
					<RichText.Content
						tagName="strong"
						className="dcx-podium__score"
						value={ values[ rank ].score }
					/>
					<RichText.Content
						tagName="p"
						className="dcx-podium__description"
						value={ values[ rank ].description }
					/>
				</div>
			) ) }
		</div>
	);
}
