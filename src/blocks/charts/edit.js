import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Button,
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import {
  FontSizePicker,
  InspectorControls,
  RichText,
  useBlockProps,
} from '@wordpress/block-editor';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { __ } from '@wordpress/i18n';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels,
);

const DEFAULT_COLORS = ['#1a2b4a', '#4cb8c4', '#5c6bc0', '#e57373', '#9e9e9e'];

function getColors() {
  return window.dcxBarChartSettings?.barColors ?? DEFAULT_COLORS;
}

function assignColors(items) {
  const colors = getColors();
  return items.map((_, i) => colors[i % colors.length]);
}

export default function Edit({ attributes, setAttributes }) {
  const {
    title,
    titleFontSize,
    items,
    chartType,
    insightText,
    modalTitle,
    modalBody,
    valueSuffix,
    xMax,
    useThemeButton,
  } = attributes;

  const blockProps = useBlockProps({ className: 'dcx-bar-chart' });

  const colors = assignColors(items);

  const chartData = {
    labels: items.map((item) => item.label),
    datasets: [
      {
        data: items.map((item) => item.value),
        backgroundColor: colors,
        borderWidth: 0,
        borderRadius: { topRight: 6, bottomRight: 6 },
        maxBarThickness: 24,
      },
    ],
  };

  const suffix = valueSuffix ?? '%';
  const fmt = (v) => v + suffix;

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${fmt(ctx.parsed.x)}`,
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
        max: xMax ?? 100,
        ticks: { callback: fmt },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${fmt(ctx.parsed)}`,
        },
      },
      datalabels: {
        color: '#fff',
        formatter: fmt,
        font: { weight: 'bold', size: 15 },
        display: (ctx) => ctx.dataset.data[ctx.dataIndex] >= 5,
      },
    },
  };

  function updateItem(index, field, value) {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setAttributes({ items: next });
  }

  function addItem() {
    setAttributes({
      items: [...items, { label: '', value: 0 }],
    });
  }

  function removeItem(index) {
    setAttributes({ items: items.filter((_, i) => i !== index) });
  }

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Titre', 'dcx-benchmark-luxe')} initialOpen={true}>
          <FontSizePicker
            value={titleFontSize}
            onChange={(value) => setAttributes({ titleFontSize: value ?? '' })}
            withReset
          />
        </PanelBody>
        <PanelBody
          title={__('Affichage', 'dcx-benchmark-luxe')}
          initialOpen={false}
        >
          <SelectControl
            label={__('Type de graphique', 'dcx-benchmark-luxe')}
            value={chartType}
            options={[
              {
                label: __('Barres horizontales', 'dcx-benchmark-luxe'),
                value: 'bar',
              },
              {
                label: __('Camembert', 'dcx-benchmark-luxe'),
                value: 'pie',
              },
            ]}
            onChange={(value) => setAttributes({ chartType: value })}
          />
        </PanelBody>
        <PanelBody
          title={__('Bouton insight', 'dcx-benchmark-luxe')}
          initialOpen={false}
        >
          <ToggleControl
            label={__('Utiliser le style du thème', 'dcx-benchmark-luxe')}
            checked={useThemeButton}
            onChange={(value) => setAttributes({ useThemeButton: value })}
          />
        </PanelBody>
        <PanelBody
          title={__('Données', 'dcx-benchmark-luxe')}
          initialOpen={false}
        >
          <TextControl
            label={__('Suffixe des valeurs', 'dcx-benchmark-luxe')}
            value={valueSuffix}
            onChange={(value) => setAttributes({ valueSuffix: value })}
            help={__('Ex : %, k€, pts… (vide = aucun)', 'dcx-benchmark-luxe')}
          />
          <TextControl
            label={__(
              'Maximum axe X (barres chart uniquement)',
              'dcx-benchmark-luxe',
            )}
            type='number'
            value={xMax}
            onChange={(value) => setAttributes({ xMax: Number(value) || 100 })}
          />
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '12px',
                marginBottom: '12px',
              }}
            >
              <TextControl
                label={__('Label', 'dcx-benchmark-luxe')}
                value={item.label}
                onChange={(value) => updateItem(index, 'label', value)}
              />
              <TextControl
                label={__(`Valeur (0–${xMax})`, 'dcx-benchmark-luxe')}
                type='number'
                min={0}
                max={100}
                value={item.value}
                onChange={(value) =>
                  updateItem(index, 'value', Number(value) || 0)
                }
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: colors[index % colors.length],
                    flexShrink: 0,
                  }}
                />
                {items.length > 1 && (
                  <Button
                    variant='tertiary'
                    isDestructive
                    onClick={() => removeItem(index)}
                  >
                    {__('Supprimer', 'dcx-benchmark-luxe')}
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button variant='secondary' onClick={addItem}>
            {__('+ Ajouter une entrée', 'dcx-benchmark-luxe')}
          </Button>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <RichText
          tagName='p'
          className='dcx-bar-chart__title'
          allowedFormats={[]}
          value={title}
          onChange={(value) => setAttributes({ title: value })}
          placeholder={__('Titre du graphique', 'dcx-benchmark-luxe')}
          style={{ fontSize: titleFontSize || undefined }}
        />

        <div className='dcx-bar-chart__chart-wrap'>
          {chartType === 'bar' ? (
            <Bar data={chartData} options={barOptions} />
          ) : (
            <Pie data={chartData} options={pieOptions} />
          )}
        </div>

        <div className='dcx-bar-chart__legend'>
          {items.map((item, index) => (
            <span key={index} className='dcx-bar-chart__legend-item'>
              <span
                className='dcx-bar-chart__legend-dot'
                style={{
                  backgroundColor: colors[index % colors.length],
                }}
              />
              {item.label}
              {item.value !== undefined &&
                item.value !== '' &&
                ` (${item.value}${suffix})`}
            </span>
          ))}
        </div>

        <div className='dcx-bar-chart__insight'>
          <RichText
            tagName='span'
            className={`dcx-bar-chart__insight-btn${useThemeButton ? ' wp-element-button wp-block-button__link' : ''}`}
            allowedFormats={[]}
            value={insightText}
            onChange={(value) => setAttributes({ insightText: value })}
            placeholder={__('Texte insight…', 'dcx-benchmark-luxe')}
          />
        </div>

        <div className='dcx-bar-chart__modal-preview'>
          <p className='dcx-bar-chart__modal-preview-label'>
            {__('Aperçu modale', 'dcx-benchmark-luxe')}
          </p>
          <RichText
            tagName='p'
            className='dcx-bar-chart__modal-title'
            allowedFormats={[]}
            value={modalTitle}
            onChange={(value) => setAttributes({ modalTitle: value })}
            placeholder={__('Titre de la modale', 'dcx-benchmark-luxe')}
          />
          <RichText
            tagName='div'
            className='dcx-bar-chart__modal-body'
            allowedFormats={['core/bold', 'core/italic']}
            value={modalBody}
            onChange={(value) => setAttributes({ modalBody: value })}
            placeholder={__('Contenu de la modale…', 'dcx-benchmark-luxe')}
          />
        </div>
      </div>
    </>
  );
}
