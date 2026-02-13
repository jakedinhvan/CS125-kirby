import { TextField } from "@mui/material";

export default function Home() {
  return (
    <>
      <h1>Welcome to Kirby - an anime suggestion engine</h1> {/* @todo: maybe placeholder lol */}
      <TextField label="Search" variant="outlined" />
    </>
  );
}
