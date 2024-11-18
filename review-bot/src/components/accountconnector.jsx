import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { useAccounts } from "../hooks/useAccounts";
import { Loader2 } from "lucide-react";

export const AccountConnector = () => {
  const [formData, setFormData] = useState({
    yandex: { apiKey: "", organizationId: "" },
    twogis: { apiKey: "", branchId: "" },
    flamp: { apiKey: "", companyId: "" },
  });

  const { connectAccount, disconnectAccount, isLoading, error, accounts } =
    useAccounts();

  const platformLabels = {
    yandex: "Яндекс Карты",
    twogis: "2ГИС",
    flamp: "Flamp",
  };

  const handleConnect = async (platform) => {
    try {
      await connectAccount(platform, formData[platform]);
      // Очищаем форму после успешного подключения
      setFormData((prev) => ({
        ...prev,
        [platform]: Object.fromEntries(
          Object.keys(prev[platform]).map((key) => [key, ""])
        ),
      }));
    } catch (error) {
      console.error(`Ошибка подключения ${platform}:`, error);
    }
  };

  const renderAccountForm = (platform) => {
    const isConnected = accounts.some(
      (acc) => acc.platform === platform && acc.status === "active"
    );
    const account = accounts.find((acc) => acc.platform === platform);

    if (isConnected) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Статус: <span className="text-green-600">Подключено</span>
              </p>
              {account?.organizationId && (
                <p className="text-sm text-muted-foreground">
                  ID: {account.organizationId}
                </p>
              )}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => disconnectAccount(account.id)}
              disabled={isLoading}
            >
              Отключить
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {platform === "yandex" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                API Ключ организации
              </label>
              <Input
                value={formData.yandex.apiKey}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    yandex: { ...prev.yandex, apiKey: e.target.value },
                  }))
                }
                type="password"
                placeholder="Введите API ключ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                ID Организации
              </label>
              <Input
                value={formData.yandex.organizationId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    yandex: { ...prev.yandex, organizationId: e.target.value },
                  }))
                }
                placeholder="12345678"
              />
            </div>
          </>
        )}

        {platform === "twogis" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">API Ключ</label>
              <Input
                value={formData.twogis.apiKey}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    twogis: { ...prev.twogis, apiKey: e.target.value },
                  }))
                }
                type="password"
                placeholder="Введите API ключ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                ID Филиала
              </label>
              <Input
                value={formData.twogis.branchId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    twogis: { ...prev.twogis, branchId: e.target.value },
                  }))
                }
                placeholder="branch_123456"
              />
            </div>
          </>
        )}

        {platform === "flamp" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">API Ключ</label>
              <Input
                value={formData.flamp.apiKey}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    flamp: { ...prev.flamp, apiKey: e.target.value },
                  }))
                }
                type="password"
                placeholder="Введите API ключ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                ID Компании
              </label>
              <Input
                value={formData.flamp.companyId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    flamp: { ...prev.flamp, companyId: e.target.value },
                  }))
                }
                placeholder="company_123456"
              />
            </div>
          </>
        )}

        <Button
          className="w-full"
          onClick={() => handleConnect(platform)}
          disabled={
            isLoading || !Object.values(formData[platform]).every(Boolean)
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Подключение...
            </>
          ) : (
            "Подключить"
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {Object.keys(platformLabels).map((platform) => (
        <Card key={platform}>
          <CardHeader>
            <CardTitle>{platformLabels[platform]}</CardTitle>
          </CardHeader>
          <CardContent>{renderAccountForm(platform)}</CardContent>
        </Card>
      ))}
    </div>
  );
};
