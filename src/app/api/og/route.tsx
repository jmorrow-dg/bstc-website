import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Bali Startup & Tech Community";
  const subtitle =
    searchParams.get("subtitle") || "Where Southeast Asia's Builders Connect";
  const type = searchParams.get("type") || "default";

  const accentColor = "#C81E1E";
  const bgColor = "#111111";
  const textColor = "#F5F5F5";
  const greyColor = "#888888";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: bgColor,
          padding: "60px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
          }}
        />

        {/* Top bar accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: accentColor,
          }}
        />

        {/* BSTC badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              color: accentColor,
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            BSTC
          </span>
          {type !== "default" && (
            <span
              style={{
                color: greyColor,
                fontSize: "16px",
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            >
              {type === "event"
                ? "Event"
                : type === "hiwa"
                ? "How I Build with AI"
                : type === "blog"
                ? "Blog"
                : ""}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            color: textColor,
            fontSize: title.length > 40 ? "48px": "56px",
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: greyColor,
            fontSize: "24px",
            lineHeight: 1.4,
            maxWidth: "700px",
          }}
        >
          {subtitle}
        </p>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <span style={{ color: greyColor, fontSize: "16px" }}>
            balistartupandtech.com
          </span>
          <span style={{ color: greyColor, fontSize: "16px" }}>
            &middot;
          </span>
          <span style={{ color: greyColor, fontSize: "16px" }}>
            2,500+ Members
          </span>
          <span style={{ color: greyColor, fontSize: "16px" }}>
            &middot;
          </span>
          <span style={{ color: greyColor, fontSize: "16px" }}>
            Bali, Indonesia
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
