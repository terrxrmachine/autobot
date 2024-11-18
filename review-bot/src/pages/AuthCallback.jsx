import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { oauthService } from "../services/oauthService";
import { Card, CardContent } from "../components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { platform } = useParams();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          throw new Error(errorDescription || error);
        }

        const result = await oauthService.handleCallback(platform, code, state);

        if (result.success) {
          navigate("/settings", {
            replace: true,
            state: { success: true, message: "Аккаунт успешно подключен" },
          });
        }
      } catch (error) {
        setError(error.message);
        setTimeout(() => {
          navigate("/settings", {
            replace: true,
            state: { error: error.message },
          });
        }, 3000);
      }
    };

    handleCallback();
  }, [platform, searchParams, navigate]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center space-x-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Завершаем авторизацию...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
