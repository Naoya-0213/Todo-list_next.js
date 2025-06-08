import Password from "@/app/components/setting-password/password";

// パスワード再設定ページ
const ResetPasswordConfirmPage = () => {
  return (
    <div className="max-w-[400px] mx-auto">
      {/* パスワード変更 */}
      <Password />
    </div>
  );
};

export default ResetPasswordConfirmPage;
