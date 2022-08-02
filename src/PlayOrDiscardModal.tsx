import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Center,
  Button,
  ModalFooter,
} from '@chakra-ui/react';
import { useState } from 'react';

import { fireworkColorToColorMap } from './constants';
import { FireworkColor, FireworkNominal } from './types';

type PlayOrDiscardModalProps = {
  isOpen: boolean;
  availableColors: FireworkColor[];
  availableNominals: FireworkNominal[];
  onClose: () => void;
  onSubmit: (color: FireworkColor, nominal: FireworkNominal) => void;
};

export function PlayOrDiscardModal({
  isOpen,
  availableColors,
  availableNominals,
  onClose,
  onSubmit,
}: PlayOrDiscardModalProps) {
  const [selectedColor, setSelectedColor] = useState<FireworkColor>();
  const [selectedNominal, setSelectedNominal] = useState<FireworkNominal>();

  function reset() {
    setSelectedColor(undefined);
    setSelectedNominal(undefined);
  }

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      size="lg"
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent bg="gray.100">
        <ModalHeader>Choose color and nominal</ModalHeader>
        <ModalCloseButton />
        <ModalBody as={VStack} gap={6}>
          <HStack gap={2}>
            {availableColors.map((color) => (
              <Center
                key={color}
                sx={{
                  aspectRatio: '2 / 3',
                  transition: 'transform 0.3s',
                  // eslint-disable-next-line no-nested-ternary
                  transform: selectedColor ? (selectedColor === color ? 'scale(1.2)' : 'scale(0.8)') : undefined,
                }}
                shadow="md"
                borderRadius={4}
                bg={fireworkColorToColorMap[color]}
                h="20vh"
                onClick={() => {
                  setSelectedColor(selectedColor === color ? undefined : color);
                }}
              />
            ))}
          </HStack>
          <HStack gap={2}>
            {availableNominals.map((nominal) => (
              <Center
                key={nominal}
                sx={{
                  aspectRatio: '2 / 3',
                  transition: 'transform 0.3s',
                  // eslint-disable-next-line no-nested-ternary
                  transform: selectedNominal ? (selectedNominal === nominal ? 'scale(1.2)' : 'scale(0.8)') : undefined,
                }}
                fontWeight="bold"
                fontSize="5xl"
                shadow="md"
                borderRadius={4}
                h="20vh"
                bg="white"
                onClick={() => {
                  setSelectedNominal(selectedNominal === nominal ? undefined : nominal);
                }}
              >
                {nominal}
              </Center>
            ))}
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={selectedColor === undefined || selectedNominal === undefined}
            colorScheme="blue"
            onClick={() => {
              onSubmit(selectedColor!, selectedNominal!);
              reset();
              onClose();
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
