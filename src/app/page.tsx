import ThemeToggles from '../components/ThemeToggles';
import BackgroundSelector from '../components/backgrounds/BackgroundSelector';

export default function Home() {
  return (
    <div className="w-full h-full container mx-auto">
      <div className=" py-12 mx-4 flex flex-col items-center justify-center">
        <h1 className="text-primary bg-primary-foreground p-4 rounded-lg text-4xl text-center font-bold">
          Multi Themes & Backgrounds
        </h1>

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-end justify-center mb-8">
          <div>
            <ThemeToggles />
          </div>

          <div className="h-25 w-px bg-primary opacity-20 hidden md:block"></div>

          <div>
            <BackgroundSelector />
          </div>
        </div>

        <div className="mt-8  p-8 rounded-lg bg-primary-foreground text-primary border border-primary border-opacity-20 max-w-lg">
          <h3 className="text-2xl mb-4">Demo Content</h3>
          <p className="mb-4">
            This demo showcases multiple themes and dynamic backgrounds. Choose
            different theme colors and background styles to create a unique
            experience.
          </p>
          <p>
            The backgrounds include space particles, a Matrix-style green grid,
            and a synthwave retro grid design.
          </p>
        </div>
      </div>
    </div>
  );
}
