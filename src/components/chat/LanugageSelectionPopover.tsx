import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Button, buttonVariants } from '../ui/button';

interface LanguageSelectionPopoverProps {
  onSelectLanguage: (languageCode: string) => void;
}

const LanguageSelectionPopover: React.FC<LanguageSelectionPopoverProps> = ({ onSelectLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-EN'); // Default language is English

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    onSelectLanguage(languageCode);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button >
          {selectedLanguage === 'en-EN' ? 'English' : selectedLanguage === 'fr-FR' ? 'French' : 'Other Language'}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ul>
          <li style={{textAlign:'center', marginBottom:'7px'}} onClick={() => handleLanguageSelect('en-EN')}>English</li><hr />
          <li style={{textAlign:'center', marginBottom:'7px'}} onClick={() => handleLanguageSelect('fr-FR')}>French</li><hr />
          <li style={{textAlign:'center', marginBottom:'7px'}} onClick={() => handleLanguageSelect('de-DE')}>German</li><hr />
          <li style={{textAlign:'center', marginBottom:'7px'}} onClick={() => handleLanguageSelect('it-IT')}>Italian</li>
          {/* Add more languages below */}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelectionPopover;
