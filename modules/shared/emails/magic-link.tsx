import { config } from "../config";

export default function MagicLink( props : {
  email: string;
  url: string;
}) {
  return (
    <div>
      <h1>Your {config.app.name} Login Link</h1>
      <p>Please click the magic link below to sign in to your account</p>
      <a href={props.url}>{props.url}</a>
    </div>
  );
}