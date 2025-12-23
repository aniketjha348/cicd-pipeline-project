import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, User, Moon, Globe, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/shared/Toast';
const Settings = () => {

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    darkMode: false,
    language: 'english',
    timezone: 'ist',
    profileVisibility: 'private',
    twoFactorAuth: false
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive important updates via email',
          type: 'toggle'
        },
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Get browser notifications',
          type: 'toggle'
        },
        {
          key: 'smsNotifications',
          label: 'SMS Notifications',
          description: 'Receive text messages for urgent updates',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Appearance',
      icon: Moon,
      items: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch to dark theme',
          type: 'toggle'
        },
        {
          key: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          options: [
            { value: 'english', label: 'English' },
            { value: 'hindi', label: 'हिंदी' },
            { value: 'spanish', label: 'Español' }
          ]
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          key: 'profileVisibility',
          label: 'Profile Visibility',
          description: 'Control who can see your profile',
          type: 'select',
          options: [
            { value: 'private', label: 'Private' },
            { value: 'friends', label: 'Friends Only' },
            { value: 'public', label: 'Public' }
          ]
        },
        {
          key: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Localization',
      icon: Globe,
      items: [
        {
          key: 'timezone',
          label: 'Timezone',
          description: 'Select your timezone',
          type: 'select',
          options: [
            { value: 'ist', label: 'IST (India Standard Time)' },
            { value: 'utc', label: 'UTC (Coordinated Universal Time)' },
            { value: 'est', label: 'EST (Eastern Standard Time)' }
          ]
        }
      ]
    }
  ];

  return (
    <div className="max-w-14xl w-full min-h-full primary-p bg-color text-color space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and privacy settings</p>
      </motion.div>

      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <section.icon className="w-5 h-5" />
                <span>{section.title}</span>
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.key}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>

                  <div className="ml-4">
                    {item.type === 'toggle' ? (
                      <Switch
                        checked={settings[item.key as keyof typeof settings] as boolean}
                        onCheckedChange={() => handleToggle(item.key)}
                      />
                    ) : item.type === 'select' && item.options ? (
                      <Select
                        value={settings[item.key as keyof typeof settings] as string}
                        onValueChange={(value) => handleSelectChange(item.key, value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Save Button */}
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default Settings;
