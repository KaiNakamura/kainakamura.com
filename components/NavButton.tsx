import { Text, UnstyledButton } from "@mantine/core";

export interface NavButtonProps {
	text: string;
}

export default function NavButton({text}: NavButtonProps) {
	return (
		<UnstyledButton>
			<Text size="xl" weight={700}>
				{text}
			</Text>
		</UnstyledButton>
	);
};