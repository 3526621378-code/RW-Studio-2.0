const MIIT_FILING_URL = "https://beian.miit.gov.cn/";

function normalizedEnvironmentValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function SiteCompliance() {
  const filingName =
    normalizedEnvironmentValue(process.env.FILING_SITE_NAME) || "若雾拾光";
  const icpNumber = normalizedEnvironmentValue(process.env.ICP_NUMBER);
  const publicSecurityNumber = normalizedEnvironmentValue(
    process.env.PUBLIC_SECURITY_NUMBER,
  );
  const publicSecurityUrl = normalizedEnvironmentValue(
    process.env.PUBLIC_SECURITY_URL,
  );

  if (!icpNumber && !publicSecurityNumber) {
    return null;
  }

  return (
    <span className="site-filing" aria-label="网站备案信息">
      <span>备案名称 / {filingName}</span>
      {icpNumber ? (
        <a href={MIIT_FILING_URL} target="_blank" rel="noreferrer">
          {icpNumber}
        </a>
      ) : null}
      {publicSecurityNumber ? (
        publicSecurityUrl ? (
          <a href={publicSecurityUrl} target="_blank" rel="noreferrer">
            {publicSecurityNumber}
          </a>
        ) : (
          <span>{publicSecurityNumber}</span>
        )
      ) : null}
    </span>
  );
}
