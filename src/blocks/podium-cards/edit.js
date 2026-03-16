import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

const CARDS = [
	{ rank: 2, medal: '🥈', label: '2ème', modifier: '2nd' },
	{ rank: 1, medal: '🥇', label: '1ère', modifier: '1st' },
	{ rank: 3, medal: '🥉', label: '3ème', modifier: '3rd' },
];

export default function Edit( { attributes, setAttributes } ) {
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

	const blockProps = useBlockProps( { className: 'dcx-podium' } );

	return (
		<div { ...blockProps }>
			{ CARDS.map( ( { rank, medal, label, modifier } ) => (
				<div
					key={ rank }
					className={ `dcx-podium__card dcx-podium__card--${ modifier }` }
				>
					<span className="dcx-podium__medal">{ medal }</span>
					<span className="dcx-podium__rank">{ label }</span>
					<RichText
						tagName="strong"
						className="dcx-podium__name"
						allowedFormats={ [] }
						value={ values[ rank ].name }
						onChange={ ( value ) =>
							setAttributes( { [ `name${ rank }` ]: value } )
						}
						placeholder={ __(
							'Nom de la maison',
							'dcx-benchmark-luxe'
						) }
					/>
					<RichText
						tagName="strong"
						className="dcx-podium__score"
						allowedFormats={ [] }
						value={ values[ rank ].score }
						onChange={ ( value ) =>
							setAttributes( { [ `score${ rank }` ]: value } )
						}
						placeholder={ __( '97/100', 'dcx-benchmark-luxe' ) }
					/>
					<RichText
						tagName="p"
						className="dcx-podium__description"
						allowedFormats={ [] }
						value={ values[ rank ].description }
						onChange={ ( value ) =>
							setAttributes( {
								[ `description${ rank }` ]: value,
							} )
						}
						placeholder={ __(
							'Description…',
							'dcx-benchmark-luxe'
						) }
					/>
				</div>
			) ) }
		</div>
	);
}
