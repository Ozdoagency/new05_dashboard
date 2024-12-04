import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Users, 
  Percent, 
  Target, 
  Globe, 
  UserCheck,
  Calculator,
  BarChart,
  Wallet,
  UserCog 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const translations = {
  en: {
    title: 'Metrics Dashboard',
    average: 'Average',
    metrics: {
      leads: 'Tech Leads',
      leadCost: 'Lead Cost',
      cr: 'CR %',
      actual: 'Budget',
      qualified: 'Qualified',
      qualCost: 'Qual Cost'
    },
    min: 'min',
    max: 'max',
    madeIn: 'Made in'
  },
  uk: {
    title: 'Панель метрик',
    average: 'Середнє',
    metrics: {
      leads: 'Тех ліди',
      leadCost: 'Вартість ліда',
      cr: 'CR %',
      actual: 'Бюджет',
      qualified: 'Кількість квалів',
      qualCost: 'Ціна квала'
    },
    min: 'мін',
    max: 'макс',
    madeIn: 'Зроблено в'
  },
  ru: {
    title: 'Панель метрик',
    average: 'Среднее',
    metrics: {
      leads: 'Тех лиды',
      leadCost: 'Стоимость лида',
      cr: 'CR %',
      actual: 'Бюджет',
      qualified: 'Количество квалов',
      qualCost: 'Цена квала'
    },
    min: 'мин',
    max: 'макс',
    madeIn: 'Сделано в'
  }
};

const SparkLine = ({ data, dataKey, color, height = 30 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data}>
      <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export default function MetricsDashboard() {
  const [data, setData] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [lang, setLang] = useState('ru'); // Объявляем переменную lang только один раз

  useEffect(() => {
    console.log("useEffect triggered");
    if (typeof window !== 'undefined') {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    window.handleResponse = (sheetData) => {
      console.log("Data received from Google Sheets:", sheetData);
      setData(sheetData);
    };

    async function fetchData() {
      const script = document.createElement('script');
      script.src = 'https://script.google.com/macros/s/AKfycbyCEKUF7S7bVEOtDkjKQrCJIP2P-SVOeHuW2O51kGdikeRHG_8kiU7s_-t8bl3eSkao2Q/exec?callback=handleResponse';
      document.body.appendChild(script);
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Data state updated:", data);
  }, [data]);

  const isMobile = width < 768;
  const t = translations[lang];
  const filteredData = useMemo(() => {
    // Фильтрация данных, если необходимо
    return data;
  }, [data]);

  const [activeMetric, setActiveMetric] = useState('leads');
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(0);
  const [showAverage, setShowAverage] = useState(true);

  const metrics = {
    leads: { 
      name: t.metrics.leads,
      color: '#2563eb', 
      icon: UserCog,
      format: val => Math.round(val)
    },
    leadCost: { 
      name: t.metrics.leadCost,
      color: '#1d4ed8', 
      icon: Calculator,
      format: val => `₴${val.toFixed(2)}`
    },
    cr: { 
      name: t.metrics.cr,
      color: '#1e40af', 
      icon: BarChart,
      format: val => `${val}%`
    },
    actual: { 
      name: t.metrics.actual,
      color: '#1e3a8a', 
      icon: Wallet,
      format: val => `₴${val.toFixed(2)}`
    },
    qualified: {
      name: t.metrics.qualified,
      color: '#172554',
      icon: UserCheck,
      format: val => Math.round(val)
    },
    qualCost: { 
      name: t.metrics.qualCost,
      color: '#0f172a', 
      icon: DollarSign,
      format: val => `₴${val.toFixed(2)}`
    }
  };

  const getAverageValue = (data, key) => {
    return data.length > 0 ? data.reduce((sum, item) => sum + item[key], 0) / data.length : 0;
  };

  return (
    <div className="container space-y-4 bg-gradient-to-br from-blue-50 to-white p-2 sm:p-6 rounded-xl">
      <div className="header flex justify-between items-center">
        <h1 className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>{t.title}</h1>
        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
          <Globe className="w-4 h-4 text-blue-600" />
          <select 
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent border-none text-sm focus:outline-none text-blue-600"
          >
            <option value="en" className="text-black">EN</option>
            <option value="uk" className="text-black">UK</option>
            <option value="ru" className="text-black">RU</option>
          </select>
        </div>
      </div>

      <div className="card bg-white/80 backdrop-blur shadow-lg rounded-lg">
        <div className="pb-2 border-b p-4">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row justify-between'} gap-4`}>
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
              <select 
                className="p-2 border rounded bg-white"
                value={startIdx}
                onChange={e => setStartIdx(Number(e.target.value))}
              >
                {data.map((_, idx) => (
                  <option key={idx} value={idx}>{data[idx].date}</option>
                ))}
              </select>
              <select 
                className="p-2 border rounded bg-white"
                value={endIdx}
                onChange={e => setEndIdx(Number(e.target.value))}
              >
                {data.map((_, idx) => (
                  <option key={idx} value={idx}>{data[idx].date}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">{t.average}:</label>
              <input
                type="checkbox"
                checked={showAverage}
                onChange={(e) => setShowAverage(e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
          </div>
        </div>
        <div className={isMobile ? 'p-2' : 'p-6'}>
          <div className="space-y-6">
            <div className={`bg-blue-50 p-1 rounded-lg flex flex-wrap gap-1 ${isMobile ? 'justify-between' : ''}`}>
              {Object.entries(metrics).map(([key, { name, icon: Icon }]) => (
                <button
                  key={key}
                  onClick={() => setActiveMetric(key)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md
                    ${isMobile ? 'flex-1 min-w-[45%] justify-center' : ''}
                    ${activeMetric === key ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}
                  `}
                >
                  <Icon className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                  <span className={isMobile ? 'text-xs' : 'text-sm'}>{name}</span>
                </button>
              ))}
            </div>
            
            <div className={isMobile ? 'h-64' : 'h-96'}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <XAxis dataKey="date" stroke="#1e40af" fontSize={isMobile ? 10 : 12} />
                  <YAxis stroke="#1e40af" width={40} fontSize={isMobile ? 10 : 12} />
                  <Tooltip />
                  {!isMobile && <Legend />}
                  {showAverage && (
                    <ReferenceLine 
                      y={getAverageValue(filteredData, activeMetric)} 
                      stroke="#94a3b8" 
                      strokeDasharray="3 3"
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey={activeMetric}
                    stroke={metrics[activeMetric].color}
                    strokeWidth={isMobile ? 1.5 : 2}
                    dot={{ r: isMobile ? 3 : 4 }}
                    activeDot={{ r: isMobile ? 5 : 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-6'} gap-4`}>
        {Object.entries(metrics).map(([key, { name, color, icon: Icon, format }]) => {
          const latestValue = filteredData[filteredData.length - 1]?.[key] ?? 0;
          const previousValue = filteredData[filteredData.length - 2]?.[key] ?? latestValue;
          const change = latestValue && previousValue ? ((latestValue - previousValue) / previousValue * 100).toFixed(1) : 0;
          const isPositive = change > 0;
          
          return (
            <div key={key} className="card bg-white/80 backdrop-blur hover:scale-105 transition-transform rounded-lg">
              <div className={isMobile ? 'p-3' : 'p-6'}>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                    <Icon className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} style={{ color }} />
                  </div>
                  {isPositive ? 
                    <ArrowUpRight className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-green-600`} /> :
                    <ArrowDownRight className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-red-600`} />
                  }
                </div>
                <div className="mt-4">
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>{name}</div>
                  <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mt-1`} style={{ color }}>
                    {format(latestValue)}
                  </div>
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(change)}%
                  </div>
                  <div className="h-8 mt-2">
                    <SparkLine 
                      data={filteredData.slice(-7)} 
                      dataKey={key} 
                      color={color} 
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500">
        {t.madeIn} <span className="font-semibold text-blue-600">OZDO AI</span>
      </div>
    </div>
  );
}