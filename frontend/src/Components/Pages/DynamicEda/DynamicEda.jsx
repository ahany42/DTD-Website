import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AppContext } from "../../../App";
import "./DynamicEda.css";

const CORE_REPORT_KEYS = new Set([
  "title",
  "summary",
  "description",
  "overview",
  "status",
  "sections",
  "recommendations",
  "warnings",
  "generated_plots",
  "visualizations",
  "visualization_paths",
  "plots",
  "charts",
  "analysis_report_path",
  "report_path",
  "local_path",
  "frontend_path",
  "filename",
]);

const PLOT_KEYS = [
  "generated_plots",
  "plots",
  "charts",
  "visualizations",
  "visualization_paths",
];

const AI_BACKEND_URL =
  import.meta.env.VITE_AI_BACKEND_URL || "http://127.0.0.1:8000";

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isEmptyValue = (value) => {
  if (value === null || value === undefined || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (isPlainObject(value)) return Object.keys(value).length === 0;
  return false;
};

const hasRenderableData = (value) => !isEmptyValue(value);

const humanizeKey = (key = "") =>
  String(key)
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatPrimitive = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return Number.isInteger(value) ? value : value.toFixed(4);
  return String(value);
};

const renderFormattedText = (value) => {
  const text = formatPrimitive(value);

  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.replace(/\*\*/g, "")}</strong>;
    }

    return <span key={index}>{part}</span>;
  });
};

const getItemLabel = (item, fallback) =>
  item?.label || item?.title || item?.name || humanizeKey(fallback);

const extractEdaPayload = (result) => {
  if (!result) return null;

  if (Object.prototype.hasOwnProperty.call(result, "data")) {
    return (
      result?.data?.report?.eda ||
      result?.data?.eda ||
      (hasRenderableData(result?.data) ? result.data : null)
    );
  }

  return (
    result?.report?.eda ||
    result?.eda ||
    (result?.title ||
    result?.summary ||
    result?.sections ||
    result?.recommendations ||
    result?.warnings
      ? result
      : null)
  );
};

const getFallbackReportId = () => {
  if (typeof window === "undefined") return "";

  const pathMatch = window.location.pathname.match(/[a-f0-9]{24}/i);
  if (pathMatch?.[0]) return pathMatch[0];

  return "";
};

const getImagePath = (plot) => {
  if (typeof plot === "string") return plot;

  return (
    plot?.frontend_path ||
    plot?.frontendPath ||
    plot?.url ||
    plot?.src ||
    plot?.image ||
    plot?.image_path ||
    plot?.imagePath ||
    plot?.path ||
    plot?.plot_path ||
    plot?.plotPath ||
    plot?.local_path ||
    ""
  );
};

const resolveImageSource = (path) => {
  if (!path) return "";

  const normalizedPath = String(path).replaceAll("\\", "/");
  const aiBackendUrl = AI_BACKEND_URL.replace(/\/$/, "");

  if (/^https?:\/\//i.test(normalizedPath)) return normalizedPath;

  const dynamicPipelineIndex = normalizedPath.indexOf("dynamic_pipeline/");
  if (dynamicPipelineIndex >= 0) {
    return `${aiBackendUrl}/Output/${normalizedPath.slice(dynamicPipelineIndex)}`;
  }

  const outputIndex = normalizedPath.toLowerCase().indexOf("output/");
  if (outputIndex >= 0) {
    return `${aiBackendUrl}/${normalizedPath.slice(outputIndex)}`;
  }

  if (normalizedPath.startsWith("/")) return normalizedPath;

  return `/${normalizedPath.replace(/^\.?\//, "")}`;
};

const getPlotTitle = (plot, index) => {
  if (typeof plot === "string") {
    const fileName = plot.replaceAll("\\", "/").split("/").pop() || `Plot ${index + 1}`;
    return humanizeKey(fileName.replace(/\.[^.]+$/, ""));
  }

  if (plot?.title || plot?.name || plot?.filename) {
    return plot.title || plot.name || plot.filename;
  }

  const imagePath = getImagePath(plot);
  if (imagePath) {
    const fileName = imagePath.replaceAll("\\", "/").split("/").pop() || "";
    if (fileName) return humanizeKey(fileName.replace(/\.[^.]+$/, ""));
  }

  return `Visualization ${index + 1}`;
};

const normalizePlotItems = (report) => {
  if (!isPlainObject(report)) return [];

  return PLOT_KEYS.flatMap((key) => {
    const value = report[key];
    if (!Array.isArray(value)) return [];

    return value
      .filter((item) => hasRenderableData(getImagePath(item)))
      .map((item, index) =>
        isPlainObject(item)
          ? { ...item, sourceKey: key, fallbackIndex: index }
          : { path: item, sourceKey: key, fallbackIndex: index }
      );
  });
};

const normalizeSections = (report) => {
  if (!isPlainObject(report)) return [];

  const explicitSections = Array.isArray(report.sections) ? report.sections : [];

  const extraSections = Object.entries(report)
    .filter(([key, value]) => !CORE_REPORT_KEYS.has(key) && hasRenderableData(value))
    .map(([key, value]) => ({
      title: humanizeKey(key),
      content: value,
      generated: true,
    }));

  return [...explicitSections, ...extraSections];
};

const canRenderTable = (items) => {
  if (!Array.isArray(items) || items.length === 0) return false;
  if (!items.every(isPlainObject)) return false;

  return items.every((item) =>
    Object.values(item).every(
      (value) => !Array.isArray(value) && !isPlainObject(value)
    )
  );
};

const renderTable = (items) => {
  const columns = Array.from(
    items.reduce((keys, item) => {
      Object.keys(item).forEach((key) => keys.add(key));
      return keys;
    }, new Set())
  );

  return (
    <div className="eda-table-wrap">
      <table className="eda-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{humanizeKey(column)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column}>{renderFormattedText(item[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderDataNode = (value, keyPrefix = "node") => {
  if (isEmptyValue(value)) {
    return <p className="text-item">No data available.</p>;
  }

  if (Array.isArray(value)) {
    if (canRenderTable(value)) return renderTable(value);

    return (
      <div className="eda-list">
        {value.map((item, index) => (
          <div key={`${keyPrefix}-${index}`} className="eda-list-item">
            {renderDataNode(item, `${keyPrefix}-${index}`)}
          </div>
        ))}
      </div>
    );
  }

  if (isPlainObject(value)) {
    return (
      <div className="eda-details-grid">
        {Object.entries(value).map(([key, itemValue]) => (
          <div key={`${keyPrefix}-${key}`} className="eda-detail-card">
            <span className="eda-detail-label">{humanizeKey(key)}</span>
            <div className="eda-detail-value">
              {Array.isArray(itemValue) || isPlainObject(itemValue)
                ? renderDataNode(itemValue, `${keyPrefix}-${key}`)
                : renderFormattedText(itemValue)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span>{renderFormattedText(value)}</span>;
};

const renderContentItem = (item, index) => {
  if (!isPlainObject(item)) {
    return (
      <div key={index} className="text-item">
        {renderDataNode(item, `content-${index}`)}
      </div>
    );
  }

  const type = String(item.type || "").toLowerCase();
  const label = getItemLabel(item, `Item ${index + 1}`);
  const value = item.value ?? item.content ?? item.description ?? item.message;

  if (type === "metric") {
    return (
      <div key={index} className="metric-item">
        <div className="metric-label">{label}</div>
        <div className="metric-value">{formatPrimitive(value)}</div>
      </div>
    );
  }

  if (type === "warning" || type === "error") {
    return (
      <div key={index} className="warning-card">
        {label && <strong>{label}: </strong>}
        {renderFormattedText(value)}
      </div>
    );
  }

  if (type === "bullet") {
    return (
      <div key={index} className="bullet-item">
        {item.label && <h4 className="bullet-label">{item.label}</h4>}
        <p>• {renderFormattedText(value)}</p>
      </div>
    );
  }

  if (type === "table" && Array.isArray(value)) {
    return <div key={index}>{renderTable(value)}</div>;
  }

  if (value !== undefined) {
    return (
      <div key={index} className="text-item">
        {item.label && <strong className="eda-inline-label">{item.label}: </strong>}
        {renderDataNode(value, `content-${index}`)}
      </div>
    );
  }

  return (
    <div key={index} className="eda-section-block">
      {renderDataNode(item, `content-${index}`)}
    </div>
  );
};

const renderSectionContent = (content, sectionIndex) => {
  if (Array.isArray(content)) {
    return content.map((item, itemIndex) =>
      renderContentItem(item, `${sectionIndex}-${itemIndex}`)
    );
  }

  return renderDataNode(content, `section-${sectionIndex}`);
};

const requestJson = async (url) => {
  const response = await fetch(url);
  const rawText = await response.text();
  let parsed = null;

  try {
    parsed = rawText ? JSON.parse(rawText) : null;
  } catch {
    parsed = rawText;
  }

  if (!response.ok) {
    const message =
      parsed?.message ||
      parsed?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return parsed;
};

function PlotCard({ plot, index, BACKEND_URL }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imagePath = getImagePath(plot);
  const imageSource = resolveImageSource(imagePath);
  const title = getPlotTitle(plot, index);
  const columns = Array.isArray(plot?.columns) ? plot.columns : [];

  if (!imageSource) return null;

  return (
    <div className="eda-card">
      <h2 className="plot-title">{title}</h2>

      {plot?.reason && <p className="plot-reason">{plot.reason}</p>}

      <div className="plot-tags">
        {plot?.plot_type && <span className="plot-type">{plot.plot_type}</span>}

        {columns.map((column, columnIndex) => (
          <span key={`${column}-${columnIndex}`} className="plot-column">
            {column}
          </span>
        ))}
      </div>

      {imageFailed ? (
        <div className="plot-placeholder">
          Plot image is listed in the report, but it is not available to display.
        </div>
      ) : (
        <img
          src={imageSource}
          alt={title}
          className="plot-image"
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  );
}

export default function DynamicEDAReport({ data }) {
  const { BACKEND_URL } = useContext(AppContext);
  const { reportId: routeReportId } = useParams();
  const [searchParams] = useSearchParams();
  const reportId =
    routeReportId ||
    searchParams.get("reportId") ||
    searchParams.get("id") ||
    getFallbackReportId();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchReport = async () => {
      setLoading(true);
      setError("");

      try {
        if (!reportId) {
          const propReport = extractEdaPayload(data);

          if (hasRenderableData(propReport)) {
            setReport(propReport);
            return;
          }

          throw new Error("Missing report id for EDA report.");
        }

        const fullReportUrl = `${BACKEND_URL}/api/reports/${reportId}?stage=eda`;
        const fullReportResult = await requestJson(fullReportUrl);
        console.log("[DynamicEda] Full report API response:", fullReportResult);

        const fallbackPayload = extractEdaPayload(fullReportResult);

        if (!hasRenderableData(fallbackPayload)) {
          throw new Error("No EDA data was found for this report.");
        }

        if (!ignore) setReport(fallbackPayload);
      } catch (fetchError) {
        console.error("[DynamicEda] Failed to load EDA report:", fetchError);

        if (!ignore) {
          setReport(null);
          setError(fetchError.message || "Failed to load EDA report.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchReport();

    return () => {
      ignore = true;
    };
  }, [BACKEND_URL, reportId]);

  const sections = useMemo(() => normalizeSections(report), [report]);
  const plots = useMemo(() => normalizePlotItems(report), [report]);
  const recommendations = Array.isArray(report?.recommendations)
    ? report.recommendations
    : [];
  const warnings = Array.isArray(report?.warnings) ? report.warnings : [];

  if (loading) {
    return <div className="eda-loading">Loading EDA report...</div>;
  }

  if (error) {
    return (
      <div className="eda-error">
        <div>
          <h2>EDA report could not be loaded</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!hasRenderableData(report)) {
    return (
      <div className="eda-empty">
        <h2>No EDA report yet</h2>
        <p>There is no EDA data available for this report.</p>
      </div>
    );
  }

  return (
    <div className="eda-page">
      <div className="eda-container">
        <div className="eda-card eda-hero-card">
          <div className="eda-header-meta">
            {report?.status && (
              <span className={`status-pill status-${String(report.status).toLowerCase()}`}>
                {humanizeKey(report.status)}
              </span>
            )}
            {reportId && <span className="eda-report-id">Report ID: {reportId}</span>}
          </div>

          <h1 className="eda-title">{report?.title || "EDA Report"}</h1>

          {(report?.summary || report?.description || report?.overview) && (
            <p className="eda-summary">
              {renderFormattedText(
                report.summary || report.description || report.overview
              )}
            </p>
          )}
        </div>

        {sections.map((section, sectionIndex) => (
          <div key={`${section?.title || "section"}-${sectionIndex}`} className="eda-card">
            <h2 className="section-title">
              {section?.title || section?.name || `Section ${sectionIndex + 1}`}
            </h2>

            <div className="section-content">
              {renderSectionContent(
                section?.content ?? section?.value ?? section,
                sectionIndex
              )}
            </div>
          </div>
        ))}

        {plots.length > 0 && (
          <div className="plots-grid">
            {plots.map((plot, index) => (
              <PlotCard
                key={`${plot.sourceKey}-${index}`}
                plot={plot}
                index={index}
                BACKEND_URL={BACKEND_URL}
              />
            ))}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="eda-card">
            <h2 className="section-title">Warnings</h2>
            <div className="recommendations-list">
              {warnings.map((warning, index) => (
                <div key={index} className="warning-card">
                  <strong>{humanizeKey(warning?.type || `Warning ${index + 1}`)}: </strong>
                  {renderFormattedText(warning?.message || warning?.value || warning)}
                  {Array.isArray(warning?.columns) && warning.columns.length > 0 && (
                    <div className="eda-chip-list">
                      {warning.columns.map((column) => (
                        <span key={column} className="plot-column">
                          {column}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="eda-card">
            <h2 className="section-title">Recommendations</h2>

            <div className="recommendations-list">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-item">
                  {renderFormattedText(recommendation)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
