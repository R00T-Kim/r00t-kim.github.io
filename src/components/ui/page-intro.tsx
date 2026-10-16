interface PageIntroProps {
  /** Shell command shown on the prompt line, e.g. "cat about_me/README.md". */
  command: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PageIntro({ command, title, description, children }: PageIntroProps) {
  return (
    <div className="border-b border-border bg-background pt-28 pb-12 md:pt-36 md:pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="prompt text-sm">
          <span className="user">gnosis@kim</span>
          <span className="text-muted-foreground">:~ # </span>
          <span className="cmd">{command}</span>
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          <span className="text-accent"># </span>
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
        {children}
      </div>
    </div>
  );
}
