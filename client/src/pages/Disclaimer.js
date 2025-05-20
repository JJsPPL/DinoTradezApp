import React from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

const Disclaimer = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white flex items-center">
        <FaExclamationTriangle className="mr-3 text-yellow-400" />
        Disclaimer
      </h1>
      
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Not Financial Advice</h2>
        <p className="text-gray-300 mb-4">
          The information provided on DinoTradez is for general informational and educational purposes only. 
          It is not intended to be and does not constitute financial advice, investment advice, trading advice, 
          or any other type of advice. You should not make any financial, investment, trading or otherwise 
          decision based on any of the information presented on this website without undertaking independent 
          due diligence and consultation with a professional financial advisor.
        </p>
        <p className="text-gray-300">
          Trading and investing in financial markets involves risk. You are solely responsible for your 
          investment decisions and should be prepared to lose some or all of your investment.
        </p>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <FaInfoCircle className="mr-3 text-blue-400" />
          Information Accuracy
        </h2>
        <p className="text-gray-300 mb-4">
          While we strive to provide accurate and up-to-date information, DinoTradez makes no 
          representations or warranties of any kind, express or implied, about the completeness, 
          accuracy, reliability, suitability, or availability of the information, products, services, 
          or related graphics contained on the website for any purpose.
        </p>
        <p className="text-gray-300">
          The information provided may be delayed, incorrect, or based on simulated data. Market data 
          is provided by third-party sources which we believe to be reliable but cannot guarantee. 
          Always cross-reference any information before making investment decisions.
        </p>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <FaMoneyBillWave className="mr-3 text-green-400" />
          High-Risk Investments
        </h2>
        <p className="text-gray-300 mb-4">
          The "Lotto Stock Picks" section features particularly high-risk investments that may experience 
          significant volatility and price movement. These picks are called "Lotto" for a reason - they 
          carry extremely high risk and most will not provide positive returns.
        </p>
        <p className="text-gray-300 mb-4">
          Never invest more than you can afford to lose in these high-risk opportunities. They should 
          only constitute a small portion, if any, of a well-diversified portfolio. The name "Lotto" 
          is intentional - you should view any money allocated to these picks as having similar odds 
          to lottery tickets.
        </p>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <FaChartLine className="mr-3 text-purple-400" />
          Dark Pool Data
        </h2>
        <p className="text-gray-300 mb-4">
          The Dark Pool Activity section presents data that is either simulated or derived from public 
          information. Actual dark pool data is private and not fully available to the public. Our 
          representation is an approximation based on volume patterns and public information.
        </p>
        <p className="text-gray-300">
          This information should be considered experimental and used for educational purposes only. 
          Do not make investment decisions based solely on the dark pool data presented.
        </p>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Third-Party Content</h2>
        <p className="text-gray-300 mb-4">
          DinoTradez may include content from third-party sources, including but not limited to market data, 
          news articles, and analyst opinions. We do not endorse or take responsibility for any third-party 
          content displayed on our website.
        </p>
        <p className="text-gray-300">
          Market data is provided by Yahoo Finance API via RapidAPI. We are not affiliated with Yahoo Finance, 
          and any issues with data accuracy should be reported to the data provider.
        </p>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Limitation of Liability</h2>
        <p className="text-gray-300 mb-4">
          In no event shall DinoTradez, its owners, operators, affiliates, or content providers be liable for 
          any losses, damages, or injuries that may result from the use of or inability to use DinoTradez, 
          or reliance on any information provided.
        </p>
        <p className="text-gray-300 mb-4">
          This includes but is not limited to direct, indirect, incidental, punitive, and consequential damages, 
          even if DinoTradez has been advised of the possibility of such damages.
        </p>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Agreement</h2>
        <p className="text-gray-300 mb-4">
          By using DinoTradez, you acknowledge and agree that you have read, understood, and accepted these 
          disclaimers and limitations. If you do not agree with any part of this disclaimer, you should 
          not use DinoTradez.
        </p>
        <p className="text-gray-300">
          We reserve the right to modify this disclaimer at any time without notice. It is your responsibility 
          to check for updates regularly.
        </p>
      </div>
      
      <div className="p-4 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg text-center">
        <p className="text-yellow-300 font-medium">
          Remember: If it seems too good to be true, it probably is.
        </p>
        <p className="text-gray-300 text-sm mt-2">
          Past performance is not indicative of future results. Always do your own research.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;