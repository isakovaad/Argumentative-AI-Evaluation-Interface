# Argumentative AI Evaluation Interface

This tool is designed as an example work for the PhD position developing evaluation frameworks for reasoning in Argumentative AI at the University of St.Gallen:

https://github.com/user-attachments/assets/628674be-cb50-40a0-be81-5a2c60e26362

## Overview
 
This project provides an interactive platform for: 
- Annotating argument components (premises, conclusions, evidence, fallacies, warrants)
- Rating argument quality across multiple dimensions
- Comparing evaluations between different AI models
- Visualizing argument structure as connected graphs
- Exporting evaluation data for further analysis

## Features 

### 1. Annotation Interface
- **Text Selection & Labeling**: Highlight text segments and classify them as premises, conclusions, evidence, fallacies, or warrants
- **Real-time Annotation Display**: View all annotations with color-coded categories
- **Annotation Counter**: Track the number of annotations made

### 2. Multi-Dimensional Rating System 
- **Logical Validity**: Assess the soundness of reasoning
- **Clarity**: Evaluate how clearly the argument is expressed 
- **Relevance**: Rate the pertinence to the topic
- **Evidence Quality**: Judge the strength of supporting evidence  
- **Automatic Average Calculation**: Real-time computation of overall quality score

### 3. Model Comparison
- **Side-by-Side Evaluation**: Compare two AI model responses simultaneously
- **Saved Evaluations**: Persist ratings and annotations for each model
- **Quality Indicators**: Visual color-coding (green/yellow/red) based on performance
- **Detailed Breakdown**: View individual rating dimensions for each model

### 4. Argument Structure Visualization 
- **Interactive Graph**: Visual representation of premises and conclusions 
- **Logical Connections**: See how premises support conclusions
- **Component Statistics**: Summary of argument structure elements

### 5. Data Management
- **Save Progress**: Store evaluations for later review
- **Export Functionality**: Download all evaluation data as JSON
- **Model Switching**: Seamlessly switch between evaluating different models
- **Clear & Reset**: Remove annotations to start fresh

## Installation & Setup

### Option 1: Direct HTML File (Easiest)

1. Download the `argument-evaluator.html` file
2. Double-click to open in your web browser
3. Start evaluating immediately

### Option 2: Local Development with Vite

```bash
# Create new React project
npm create vite@latest argument-evaluator -- --template react
cd argument-evaluator

# Install dependencies
npm install
npm install lucide-react

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure Tailwind (tailwind.config.js):
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update src/index.css:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Copy the component code to src/App.jsx and run:
```bash
npm run dev
```

Visit http://localhost:5173

## Usage Guide

### Evaluating Arguments

1. **Select a Model**: Choose between Model A or Model B using the buttons at the top
2. **Read the Argument**: Review the AI-generated text in the gray box
3. **Add Annotations**:
   - Highlight text with your mouse
   - Click on annotation type (Premise, Conclusion, Evidence, Fallacy, Warrant)
   - View annotations in the right panel
4. **Rate Quality**: Use the 1-5 rating scales for each dimension
5. **Save Progress**: Click "Save Progress" to store your evaluation
6. **Switch Models**: Evaluate the second model using the same process

### Comparing Models

1. Navigate to the Comparison tab
2. View side-by-side evaluations with:
   - Full argument text
   - Average ratings
   - Individual dimension scores
   - Number of annotations
   - Quality assessment summary

### Visualizing Structure

1. Go to the Structure tab
2. View the argument graph showing:
   - Premises (blue boxes)
   - Conclusions (green boxes)
   - Logical connections (arrows)
3. Review summary statistics for argument components

### Exporting Data

1. Click Export Data button
2. A JSON file will download containing:
   - All saved evaluations
   - Current evaluation state
   - Timestamps
   - Complete annotation and rating data

## Annotation Types

| Type | Color | Description |
|------|-------|-------------|
| Premise | Blue | Supporting statements or reasons |
| Conclusion | Green | Main claims or inferences |
| Evidence | Yellow | Data, facts, or empirical support |
| Fallacy | Red | Logical errors or flawed reasoning |
| Warrant | Purple | Connecting principles linking premises to conclusions |

## Rating Dimensions

- **Logical Validity (1-5)**: Is the reasoning sound and free from logical errors?
- **Clarity (1-5)**: Is the argument expressed clearly and understandably?
- **Relevance (1-5)**: Does the argument address the topic appropriately?
- **Evidence Quality (1-5)**: Is the evidence strong, credible, and sufficient?

## Data Export Format

```json
{
  "evaluations": {
    "argument1": {
      "argument": {...},
      "annotations": [...],
      "ratings": {...},
      "averageRating": "3.8",
      "timestamp": "2025-10-02T10:30:00.000Z"
    },
    "argument2": {...}
  },
  "currentEvaluation": {...},
  "timestamp": "2025-10-02T10:35:00.000Z"
}
```

## Technical Details

### Built With

- **React 18**: UI framework for interactive components
- **Tailwind CSS**: Utility-first CSS framework
- **SVG**: Vector graphics for argument visualization
- **Vanilla JavaScript**: Core functionality and data management
