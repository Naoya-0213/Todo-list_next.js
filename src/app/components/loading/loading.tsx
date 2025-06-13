// 各フォルダ内のloading.tsxの共通化
// ローディング中の画面を編集したいときはここを変更！

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center mt-10">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
    </div>
  );
};

export default LoadingSpinner;
