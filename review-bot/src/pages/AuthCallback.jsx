import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { oauthService } from "../services/oauthService";
import { Card, CardContent } from "../components/ui/card";
import { Loader2 } from "lucide-react";

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { platform } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await oauthService.handleCallback(platform, code, state);
        // Перенаправляем обратно на страницу настроек
        navigate("/settings", {
          replace: true,
          state: { success: true, platform },
        });
      } catch (error) {
        console.error("Ошибка при обработке callback:", error);
        navigate("/settings", {
          replace: true,
          state: { error: error.message },
        });
      }
    };

    handleCallback();
  }, [platform, code, state, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Завершаем подключение аккаунта...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
