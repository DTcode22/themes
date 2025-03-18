import ThemeToggles from '../components/ThemeToggles';

export default function Home() {
  return (
    <div className="w-full h-full container p-4 mx-auto ">
      <div className="py-20 flex flex-col items-center justify-center text-gray-800 dark:text-gray-100 ">
        <h1 className="text-primary text-5xl text-center  font-bold">
          Multi Themes
        </h1>
        <ThemeToggles />
      </div>
    </div>
  );
}
