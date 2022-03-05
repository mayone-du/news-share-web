import { getProviders, signIn } from "next-auth/react";

// サインイン関数
export const handleSignIn = async () => {
  const providers = await getProviders();
  if (providers) {
    // Slack認証しか登録していないため、SlackのIDが入る
    const [providerId] = Object.values(providers).map((provider) => {
      return provider.id;
    });
    await signIn(providerId);
  }
};
