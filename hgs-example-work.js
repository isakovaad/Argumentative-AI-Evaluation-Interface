import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, Eye, BarChart3, MessageSquare, Save, Download, ArrowRight } from 'lucide-react';

const ArgumentEvaluator = () => {
  const [activeTab, setActiveTab] = useState('annotate');
  const [selectedText, setSelectedText] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const [ratings, setRatings] = useState({
    logical_validity: 0,
    clarity: 0,
    relevance: 0,
    evidence_quality: 0
  });
  
  // Sample AI-generated arguments for evaluation
  const sampleArguments = {
    argument1: {
      title: "AI Model A Response",
      text: "Climate change requires immediate action because scientific consensus shows that human activities are the primary driver of global warming. The IPCC reports demonstrate that without rapid decarbonization, we face catastrophic consequences including sea level rise, extreme weather events, and ecosystem collapse. Therefore, governments must implement carbon pricing and renewable energy mandates within the next decade to limit warming to 1.5°C.",
      components: []
    },
    argument2: {
      title: "AI Model B Response", 
      text: "While climate change is a serious issue, economic considerations must be balanced with environmental goals. Rapid transitions to renewable energy could cause job losses in traditional industries and increase energy costs for consumers. A gradual approach that includes carbon capture technology, nuclear energy, and market-based solutions would be more practical than aggressive mandates that could harm economic growth.",
      components: []
    }
  };

  const [currentArgument, setCurrentArgument] = useState(sampleArguments.argument1);
  const [argumentStructure, setArgumentStructure] = useState([
    { id: 1, type: 'premise', text: 'Scientific consensus shows human activities drive warming', parent: null, x: 100, y: 50 },
    { id: 2, type: 'premise', text: 'IPCC reports show catastrophic consequences without action', parent: null, x: 100, y: 150 },
    { id: 3, type: 'conclusion', text: 'Governments must implement rapid policy changes', parent: [1, 2], x: 300, y: 100 }
  ]);

  const annotationTypes = [
    { type: 'premise', label: 'Premise', color: 'bg-blue-100 border-blue-300' },
    { type: 'conclusion', label: 'Conclusion', color: 'bg-green-100 border-green-300' },
    { type: 'evidence', label: 'Evidence', color: 'bg-yellow-100 border-yellow-300' },
    { type: 'fallacy', label: 'Fallacy', color: 'bg-red-100 border-red-300' },
    { type: 'warrant', label: 'Warrant', color: 'bg-purple-100 border-purple-300' }
  ];

  const fallacyTypes = [
    'Ad Hominem', 'Straw Man', 'False Dilemma', 'Appeal to Authority', 
    'Slippery Slope', 'Circular Reasoning', 'Hasty Generalization'
  ];

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      setSelectedText(selection.toString());
    }
  };

  const addAnnotation = (type, fallacyType = null) => {
    if (!selectedText) return;
    
    const newAnnotation = {
      id: Date.now(),
      text: selectedText,
      type: type,
      fallacyType: fallacyType,
      timestamp: new Date().toISOString()
    };
    
    setAnnotations([...annotations, newAnnotation]);
    setSelectedText('');
    window.getSelection().removeAllRanges();
  };

  const updateRating = (dimension, value) => {
    setRatings(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  const exportData = () => {
    const exportData = {
      argument: currentArgument,
      annotations: annotations,
      ratings: ratings,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'argument_evaluation.json';
    link.click();
  };

  const ArgumentVisualization = () => (
    <div className="relative w-full h-96 bg-gray-50 border rounded-lg overflow-hidden">
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Draw connections */}
        {argumentStructure.map(node => (
          node.parent && Array.isArray(node.parent) ? node.parent.map(parentId => {
            const parentNode = argumentStructure.find(n => n.id === parentId);
            return parentNode ? (
              <line
                key={`${parentId}-${node.id}`}
                x1={parentNode.x + 50}
                y1={parentNode.y + 20}
                x2={node.x + 50}
                y2={node.y + 20}
                stroke="#6b7280"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            ) : null;
          }) : null
        ))}
        
        {/* Arrow marker definition */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>
      </svg>
      
      {/* Draw nodes */}
      {argumentStructure.map(node => (
        <div
          key={node.id}
          className={`absolute w-32 h-16 p-2 text-xs rounded border-2 ${
            node.type === 'premise' ? 'bg-blue-100 border-blue-300' :
            node.type === 'conclusion' ? 'bg-green-100 border-green-300' :
            'bg-gray-100 border-gray-300'
          }`}
          style={{ left: node.x, top: node.y }}
        >
          <div className="font-semibold capitalize">{node.type}</div>
          <div className="text-xs">{node.text.substring(0, 40)}...</div>
        </div>
      ))}
    </div>
  );

  const RatingScale = ({ dimension, label, value, onChange }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{value}/5</span>
      </div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            onClick={() => onChange(dimension, rating)}
            className={`w-8 h-8 rounded border-2 ${
              rating <= value 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Argumentative AI Evaluation Interface
        </h1>
        <p className="text-gray-600">
          Systematically evaluate and annotate AI-generated arguments
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'annotate', label: 'Annotation', icon: MessageSquare },
            { id: 'compare', label: 'Comparison', icon: Eye },
            { id: 'visualize', label: 'Structure', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Annotation Tab */}
      {activeTab === 'annotate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Argument Text */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">{currentArgument.title}</h3>
              <div 
                className="text-gray-800 leading-relaxed cursor-text select-text"
                onMouseUp={handleTextSelection}
              >
                {currentArgument.text}
              </div>
            </div>
            
            {selectedText && (
              <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-4">
                <p className="text-sm text-blue-800 mb-2">Selected: "{selectedText}"</p>
                <div className="flex flex-wrap gap-2">
                  {annotationTypes.map(type => (
                    <button
                      key={type.type}
                      onClick={() => addAnnotation(type.type)}
                      className={`px-3 py-1 text-xs rounded border ${type.color}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Annotation Panel */}
          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Annotations</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {annotations.map(annotation => (
                  <div
                    key={annotation.id}
                    className={`p-2 rounded border ${
                      annotationTypes.find(t => t.type === annotation.type)?.color
                    }`}
                  >
                    <div className="font-medium text-xs capitalize">
                      {annotation.type}
                    </div>
                    <div className="text-sm">{annotation.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating System */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Quality Ratings</h3>
              <RatingScale 
                dimension="logical_validity" 
                label="Logical Validity" 
                value={ratings.logical_validity}
                onChange={updateRating}
              />
              <RatingScale 
                dimension="clarity" 
                label="Clarity" 
                value={ratings.clarity}
                onChange={updateRating}
              />
              <RatingScale 
                dimension="relevance" 
                label="Relevance" 
                value={ratings.relevance}
                onChange={updateRating}
              />
              <RatingScale 
                dimension="evidence_quality" 
                label="Evidence Quality" 
                value={ratings.evidence_quality}
                onChange={updateRating}
              />
            </div>
          </div>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'compare' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Model A Response</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-800 leading-relaxed">
                {sampleArguments.argument1.text}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg Rating: 3.8/5</span>
              <span className="text-green-600">Strong logical structure</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Model B Response</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-800 leading-relaxed">
                {sampleArguments.argument2.text}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg Rating: 3.2/5</span>
              <span className="text-yellow-600">Balanced but weaker evidence</span>
            </div>
          </div>
        </div>
      )}

      {/* Visualization Tab */}
      {activeTab === 'visualize' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Argument Structure Visualization</h3>
            <ArgumentVisualization />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800">Premises</h4>
              <p className="text-2xl font-bold text-blue-600">2</p>
              <p className="text-sm text-blue-600">Supporting statements</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800">Conclusions</h4>
              <p className="text-2xl font-bold text-green-600">1</p>
              <p className="text-sm text-green-600">Main claims</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800">Connections</h4>
              <p className="text-2xl font-bold text-purple-600">2</p>
              <p className="text-sm text-purple-600">Logical links</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <div className="flex space-x-3">
          <button 
            onClick={() => setAnnotations([])}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Clear Annotations
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Save Progress
          </button>
        </div>
        <button 
          onClick={exportData}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>
    </div>
  );
};

export default ArgumentEvaluator;