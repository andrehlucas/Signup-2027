'use client';

/*
 * Astryx sandbox: a scratch page for trying Astryx components inside this
 * app's real CSS stack (Tailwind v3 + Astryx layers). Not linked from the
 * signup flow. Safe to delete once the redesign is under way.
 */
import { useState } from 'react';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Switch } from '@astryxdesign/core/Switch';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';

export default function AstryxSandbox() {
  const [email, setEmail] = useState('');
  const [mailForwarding, setMailForwarding] = useState(true);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Card>
        <VStack gap={4}>
          <HStack gap={2} vAlign="center">
            <Heading level={2}>Astryx sandbox</Heading>
            <Badge label="Neutral theme" />
          </HStack>
          <Text>
            Astryx components rendered inside the signup app&apos;s own
            styles.
          </Text>
          <TextInput
            label="Work email"
            placeholder="name@example.com"
            value={email}
            onChange={setEmail}
          />
          <Switch
            label="Mail forwarding"
            description="Forward scanned mail to your inbox"
            value={mailForwarding}
            onChange={setMailForwarding}
          />
          <HStack gap={2} hAlign="end">
            <Button label="Cancel" variant="secondary" />
            <Button label="Continue" variant="primary" />
          </HStack>
        </VStack>
      </Card>
    </div>
  );
}
