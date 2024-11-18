import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RefreshCw } from "lucide-react";
import { useAutoResponder } from "@/hooks/useAutoResponder";

export const BotControl = () => {
  const {
    isRunning,
    status,
    startBot,
    stopBot,
    checkNewReviews,
    isLoading,
    error,
  } = useAutoResponder();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Управление ботом</span>
          <div className="space-x-2">
            <Button
              variant={isRunning ? "destructive" : "default"}
              onClick={isRunning ? stopBot : startBot}
              disabled={isLoading}
            >
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Остановить
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Запустить
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={checkNewReviews}
              disabled={isLoading || !isRunning}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Проверить отзывы
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Статус:</p>
              <p className="text-2xl font-bold">
                {isRunning ? "Активен" : "Остановлен"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Активные платформы:</p>
              <p className="text-2xl font-bold">
                {status?.activePlatforms?.length || 0}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md">{error}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
