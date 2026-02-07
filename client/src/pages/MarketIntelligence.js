import React, { useEffect, useState } from 'react';
import { FaNewspaper, FaFileAlt, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const MarketIntelligence = () => {
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchS3Filings();
  }, []);

  const fetchS3Filings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/sec-filings?form=S-3&limit=20');
      if (response.data && response.data.filings) {
        setFilings(response.data.filings);
      }
    } catch (err) {
      console.error('Error fetching S-3 filings:', err);
      setError('Unable to load S-3 filings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Market Intelligence</h1>

      {/* S-3 Offerings Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FaFileAlt className="mr-2 text-yellow-400" />
            Latest S-3 Offerings
          </h2>
          <a
            href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=S-3&dateb=&owner=include&count=40&search_text=&action=getcompany"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
          >
            View All on EDGAR <FaExternalLinkAlt className="ml-1" size={10} />
          </a>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Source: SEC EDGAR &mdash; S-3 registration statements for secondary offerings
        </p>

        {loading && (
          <div className="card flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-blue-400 mr-3" size={20} />
            <p className="text-gray-400">Loading S-3 filings...</p>
          </div>
        )}

        {error && (
          <div className="card border-red-800 bg-red-900/20">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchS3Filings}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filings.length === 0 && (
          <div className="card">
            <p className="text-gray-400 text-center">No recent S-3 filings found</p>
          </div>
        )}

        {!loading && !error && filings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Ticker</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Filed</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Form</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Link</th>
                </tr>
              </thead>
              <tbody>
                {filings.map((filing, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-white font-medium">
                      {filing.companyName || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      {filing.ticker ? (
                        <span className="text-green-400 font-mono font-bold">
                          {filing.ticker}
                        </span>
                      ) : (
                        <span className="text-gray-500">--</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {formatDate(filing.filedDate)}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {filing.formType || 'S-3'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {filing.filingUrl ? (
                        <a
                          href={filing.filingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <FaExternalLinkAlt size={12} />
                        </a>
                      ) : (
                        <span className="text-gray-500">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* News Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FaNewspaper className="mr-2 text-blue-400" />
            Market News
          </h2>
        </div>
        <div className="card">
          <p className="text-gray-400 text-center py-4">
            Market news feed coming soon. Check the Dashboard for latest updates.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MarketIntelligence;
