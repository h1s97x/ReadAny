/**
 * MarkdownRenderer — renders markdown content in React Native
 * Uses react-native-markdown-display under the hood.
 */
import Markdown from "react-native-markdown-display";
import { useColors } from "@/styles/theme";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const colors = useColors();

  return (
    <Markdown
      style={{
        body: { color: colors.foreground, fontSize: 13, lineHeight: 19 },
        text: { color: colors.foreground, fontSize: 13, lineHeight: 19 },
        paragraph: { color: colors.foreground, fontSize: 13, lineHeight: 19, marginBottom: 4, marginTop: 0 },
        heading1: { color: colors.foreground, fontSize: 15, fontWeight: "600", marginBottom: 4, marginTop: 4 },
        heading2: { color: colors.foreground, fontSize: 14, fontWeight: "600", marginBottom: 3, marginTop: 3 },
        heading3: { color: colors.foreground, fontSize: 13, fontWeight: "600", marginBottom: 2, marginTop: 2 },
        strong: { fontWeight: "700", color: colors.foreground },
        em: { fontStyle: "italic", color: colors.mutedForeground },
        link: { color: colors.primary },
        code_inline: { backgroundColor: colors.muted, color: colors.foreground, fontSize: 12, fontFamily: "Menlo" },
        code_block: { backgroundColor: colors.muted, color: colors.foreground, fontSize: 12, fontFamily: "Menlo", padding: 8 },
        fence: { backgroundColor: colors.muted, color: colors.foreground, fontSize: 12, fontFamily: "Menlo", padding: 8 },
        blockquote: {
          borderLeftWidth: 2,
          borderLeftColor: colors.mutedForeground,
          paddingLeft: 10,
          backgroundColor: "transparent",
          color: colors.foreground,
        },
        bullet_list: { marginVertical: 2 },
        ordered_list: { marginVertical: 2 },
        list_item: { marginBottom: 2, flexDirection: "row" },
        bullet_list_icon: { color: colors.foreground, marginLeft: 0, marginRight: 8 },
        bullet_list_content: { color: colors.foreground, flex: 1 },
        ordered_list_icon: { color: colors.foreground, marginLeft: 0, marginRight: 8 },
        ordered_list_content: { color: colors.foreground, flex: 1 },
      }}
    >
      {content}
    </Markdown>
  );
}
