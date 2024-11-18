import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { LogIn, ExternalLink } from "lucide-react";
import { useAccounts } from "../hooks/useAccounts";
import { oauthService } from "../services/oauthService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const PLATFORMS = {
  yandex: {
    name: "Яндекс Карты",
    icon: "/icons/yandex.svg",
    description: "Подключите аккаунт Яндекс.Бизнес для работы с отзывами",
    type: "oauth",
  },
  twogis: {
    name: "2ГИС",
    icon: "/icons/2gis.svg",
    description: "Подключите организацию из 2ГИС",
    type: "manual",
    instructions: [
      '1. Нажмите "Войти в 2ГИС"',
      "2. Авторизуйтесь в своем аккаунте",
      "3. Перейдите в панель управления",
      "4. Скопируйте API ключ из настроек",
      "5. Вставьте API ключ в поле ниже",
    ],
  },
  flamp: {
    name: "Flamp",
    icon: "/icons/flamp.svg",
    description: "Подключите компанию из Flamp",
    type: "manual",
    instructions: [
      '1. Нажмите "Войти во Flamp"',
      "2. Авторизуйтесь в своем аккаунте",
      "3. Перейдите в настройки компании",
      "4. Скопируйте API ключ",
      "5. Вставьте API ключ в поле ниже",
    ],
  },
};

export const AccountSettings = () => {
  const {
    accounts = [],
    error,
    isLoading,
    connectAccount,
    disconnectAccount,
  } = useAccounts();

  const handleConnect = async (platform) => {
    try {
      await oauthService.initiateAuth(platform);
    } catch (error) {
      console.error("Ошибка при инициализации авторизации:", error);
    }
  };

  const renderConnectButton = (platform, type) => {
    if (type === "oauth") {
      return (
        <Button
          className="w-full"
          onClick={() => handleConnect(platform)}
          disabled={isLoading}
        >
          <LogIn className="h-4 w-4 mr-2" />
          Подключить через OAuth
        </Button>
      );
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <LogIn className="h-4 w-4 mr-2" />
            Подключить
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подключение {PLATFORMS[platform].name}</DialogTitle>
            <DialogDescription>
              Выполните следующие шаги для подключения:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              {PLATFORMS[platform].instructions.map((instruction, index) => (
                <p key={index} className="text-sm">
                  {instruction}
                </p>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleConnect(platform)}>
                Войти в {PLATFORMS[platform].name}
              </Button>
              <Button
                variant="outline"
                onClick={() => oauthService.goToBusinessPanel(platform)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Панель управления
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(PLATFORMS).map(
          ([platform, { name, icon, description, type }]) => {
            const isConnected = accounts.some(
              (acc) => acc.platform === platform && acc.status === "active"
            );

            return (
              <Card key={platform}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <img src={icon} alt={name} className="w-6 h-6" />
                    <span>{name}</span>
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isConnected ? (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        const account = accounts.find(
                          (acc) => acc.platform === platform
                        );
                        if (account) disconnectAccount(account.id);
                      }}
                      disabled={isLoading}
                    >
                      Отключить
                    </Button>
                  ) : (
                    renderConnectButton(platform, type)
                  )}
                </CardContent>
              </Card>
            );
          }
        )}
      </div>
    </div>
  );
};
