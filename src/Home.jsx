import App from "./App";
import { defaultContent } from "./content/defaultContent";

export default function Home({ content }) {
  return <App content={content || defaultContent} />;
}