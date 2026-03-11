import EdaVisualization from "../Visualization/EdaVisualization";
const dataJson = `{
  "meta": [
    {
      "title": "Agent",
      "value": "Titanic-Dataset_raw_analysis"
    },
    {
      "title": "Stage",
      "value": "raw"
    },
    {
      "title": "Dataset Name",
      "value": "Titanic-Dataset_raw"
    },
    {
      "title": "Timestamp",
      "value": "2026-03-10T03:55:04.338160"
    }
  ],
  "summary": [
    {
      "title": "N Rows",
      "value": 891
    },
    {
      "title": "N Columns",
      "value": 12
    },
    {
      "title": "Column Types",
      "value": [
        {
          "title": "Numerical",
          "value": [
            "PassengerId",
            "Survived",
            "Pclass",
            "Age",
            "SibSp",
            "Parch",
            "Fare"
          ]
        },
        {
          "title": "Categorical",
          "value": [
            "Name",
            "Sex",
            "Ticket",
            "Cabin",
            "Embarked"
          ]
        },
        {
          "title": "Datetime",
          "value": []
        },
        {
          "title": "Boolean",
          "value": []
        }
      ]
    },
    {
      "title": "Memory Usage Mb",
      "value": 0.28
    },
    {
      "title": "Duplicate Rows",
      "value": 0
    },
    {
      "title": "Target Column",
      "value": "Survived"
    },
    {
      "title": "Target Dtype",
      "value": "int64"
    }
  ],
  "target_analysis": [
    {
      "title": "Column",
      "value": "Survived"
    },
    {
      "title": "Dtype",
      "value": "int64"
    },
    {
      "title": "Task Type",
      "value": "classification"
    },
    {
      "title": "N Classes",
      "value": 2
    },
    {
      "title": "Is Binary",
      "value": true
    },
    {
      "title": "Number of Classes",
      "value": 2
    },
    {
      "title": "Imbalance Ratio",
      "value": 1.61
    },
    {
      "title": "Imbalance Severity",
      "value": "none"
    },
    {
      "title": "Entropy",
      "value": 0.9607
    },
    {
      "title": "Requires Stratification",
      "value": true
    },
    {
      "title": "Class Distribution",
      "value": [
        {
          "class": "0",
          "ratio": 0.6162
        },
        {
          "class": "1",
          "ratio": 0.3838
        }
      ]
    }
  ],
  "data_quality": [
    {
      "title": "Total Missing Cells",
      "value": 1732
    },
    {
      "title": "Duplicate Count",
      "value": 891
    },
    {
      "title": "Duplicate Ratio",
      "value": 0.5
    }
  ],
  "relationships": [
    {
      "title": "PassengerId (Cramer's V)",
      "value": 0.0
    },
    {
      "title": "Pclass (Cramer's V)",
      "value": 0.34
    },
    {
      "title": "Name (Cramer's V)",
      "value": 0.0
    },
    {
      "title": "Sex (Cramer's V)",
      "value": 0.543
    },
    {
      "title": "Age (Cramer's V)",
      "value": 0.0
    },
    {
      "title": "SibSp (Cramer's V)",
      "value": 0.205
    },
    {
      "title": "Parch (Cramer's V)",
      "value": 0.177
    },
    {
      "title": "Ticket (Cramer's V)",
      "value": 0.0
    },
    {
      "title": "Fare (Cramer's V)",
      "value": 0.0
    },
    {
      "title": "Cabin (Cramer's V)",
      "value": 0.0
    },
    {
      "title": "Embarked (Cramer's V)",
      "value": 0.173
    }
  ],
  "columns": [
    {
      "title": "PassengerId",
      "type": "categorical",
      "missing_count": 0,
      "unique_count": 891,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "1",
          "count": 2
        },
        {
          "value": "2",
          "count": 2
        },
        {
          "value": "3",
          "count": 2
        },
        {
          "value": "4",
          "count": 2
        },
        {
          "value": "5",
          "count": 2
        }
      ]
    },
    {
      "title": "Survived",
      "type": "categorical",
      "missing_count": 0,
      "unique_count": 2,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "0",
          "count": 1098
        },
        {
          "value": "1",
          "count": 684
        }
      ]
    },
    {
      "title": "Pclass",
      "type": "categorical",
      "missing_count": 0,
      "unique_count": 3,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "3",
          "count": 982
        },
        {
          "value": "1",
          "count": 432
        },
        {
          "title": "N Columns With Missing",
          "value": 3
        }
      ]
    },
    {
      "title": "Duplicates",
      "value": [
        {
          "title": "Duplicate Row Count",
          "value": 0
        },
        {
          "title": "Duplicate Ratio",
          "value": 0.0
        }
      ]
    },
    {
      "title": "Low Variance Columns",
      "value": [
        {
          "title": "Constant Columns",
          "value": []
        },
        {
          "title": "Near Constant Columns",
          "value": []
        }
      ]
    },
    {
      "title": "Age",
      "type": "categorical",
      "missing_count": 354,
      "unique_count": 88,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "24",
          "count": 60
        },
        {
          "value": "22",
          "count": 54
        },
        {
          "value": "18",
          "count": 52
        },
        {
          "value": "28",
          "count": 50
        },
        {
          "value": "30",
          "count": 50
        }
      ]
    },
    {
      "title": "SibSp",
      "type": "categorical",
      "missing_count": 0,
      "unique_count": 7,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "0",
          "count": 1216
        },
        {
          "value": "1",
          "count": 418
        },
        {
          "value": "2",
          "count": 56
        },
        {
          "value": "4",
          "count": 36
        },
        {
          "value": "3",
          "count": 32
        }
      ]
    },
    {
      "title": "Parch",
      "type": "categorical",
      "missing_count": 0,
      "unique_count": 7,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "0",
          "count": 1356
        },
        {
          "value": "1",
          "count": 236
        },
        {
          "value": "2",
          "count": 160
        },
        {
          "value": "5",
          "count": 10
        },
        {
          "value": "3",
          "count": 10
        }
      ]
    },
    {
      "title": "Ticket",
      "type": "categorical",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 681,
      "is_unique_per_row": false,
      "top_values": {
        "347082": 7,
        "1601": 7,
        "CA. 2343": 7,
        "3101295": 6,
        "CA 2144": 6
      },
      "is_high_cardinality": true
    },
    "Fare": {
      "data_type": "numeric",
      "dtype": "float64",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 248,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "8.05",
          "count": 86
        },
        {
          "value": "13",
          "count": 84
        },
        {
          "value": "7.8958",
          "count": 76
        },
        {
          "value": "7.75",
          "count": 68
        },
        {
          "value": "26",
          "count": 62
        }
      ]
    },
    {
      "title": "Cabin",
      "type": "categorical",
      "missing_count": 1374,
      "unique_count": 147,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "G6",
          "count": 8
        },
        {
          "value": "C23 C25 C27",
          "count": 8
        },
        {
          "value": "B96 B98",
          "count": 8
        },
        {
          "value": "F2",
          "count": 6
        },
        {
          "value": "D",
          "count": 6
        }
      ]
    },
    {
      "title": "Embarked",
      "type": "categorical",
      "missing_count": 4,
      "unique_count": 3,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "S",
          "count": 1288
        },
        {
          "value": "C",
          "count": 336
        },
        {
          "value": "Q",
          "count": 154
        }
      ]
    }
  ],
  "warnings": [
    {
      "title": "High Missingness",
      "columns": [
        "Cabin"
      ],
      "message": "Columns with > 50% missing values detected."
    }
  ]
}`;
export default function RawAnalysisDashboard() {
  return <EdaVisualization dataJson={dataJson} />;
}