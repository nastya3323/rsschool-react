interface PasswordStrengthProps {
  checks: string[];
}

export default function PasswordStrength({ checks }: PasswordStrengthProps) {
  let strengthText;

  if (checks.length === 4) {
    strengthText = <span style={{ color: 'green' }}>strong</span>;
  } else if (checks.length === 3) {
    strengthText = <span style={{ color: 'yellow' }}>average</span>;
  } else {
    strengthText = <span style={{ color: 'red' }}>weak</span>;
  }

  return <div>Password strength: {strengthText}</div>;
}
