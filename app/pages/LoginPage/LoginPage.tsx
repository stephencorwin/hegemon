import React, {useEffect, useState} from 'react';
import {Main, FormWrapper, FormInputRow, ProfileTileWrapper} from './styles';
import {useHegemon} from '../../hooks';
import {ProfileTile} from './ProfileTile';

export function LoginPage() {
  const {snapshot, store} = useHegemon();
  const {fetchSavedProfiles, registerProfile, savedProfiles} = snapshot;
  const [apiKey, setApiKey] = useState('');
  const [isPaper, setIsPaper] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    registerProfile(apiKey, isPaper);
  };

  useEffect(() => {
    fetchSavedProfiles();
  }, [fetchSavedProfiles, store]);

  return (
    <Main>
      <FormWrapper>
        <h1>Hegemon</h1>
        <form onSubmit={handleSubmit}>
          <FormInputRow>
            <input
              type="password"
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Key"
            />
            <button type="submit">Register</button>
          </FormInputRow>
          <FormInputRow onClick={() => setIsPaper((prev) => !prev)}>
            <input type="checkbox" checked={isPaper} readOnly />
            <label>Paper Trading</label>
          </FormInputRow>
        </form>
      </FormWrapper>

      {/* SAVED PROFILES */}
      <ProfileTileWrapper>
        {savedProfiles.map((savedProfile) => (
          <ProfileTile
            key={savedProfile.id}
            id={savedProfile.id}
            apiKey={savedProfile.apiKey}
            isPaper={savedProfile.isPaper}
            nickname={savedProfile.nickname}
          />
        ))}
      </ProfileTileWrapper>
    </Main>
  );
}
