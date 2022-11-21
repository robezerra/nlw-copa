import Image from 'next/image';
import { FormEvent, useState } from 'react';

import { api } from '../lib/axios';

import logo from '../assets/logo.svg';
import CheckIcon from '../assets/check-icon.svg';
import appPreview from '../assets/cellphones.png';
import usersExample from '../assets/users-example.png';

interface HomeProps {
	userCount: number;
	poolCount: number;
	guessCount: number;
}

export default function Home(props: HomeProps) {
	const [poolTitle, setPoolTitle] = useState('');

	async function createPool(event: FormEvent) {
		event.preventDefault();

		try {
			const response = await api.post('/pools', {
				title: poolTitle,
			});

			const { code } = response.data;

			await navigator.clipboard.writeText(code);

			alert(
				'Bolão criado com sucesso! O código foi copiado para a área de transferência.'
			);

			setPoolTitle('');
		} catch (err) {
			console.log(err);

			alert('Falha ao criar o bolão. Por favor, tente novamente!');
		}
	}

	return (
		<div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
			<main>
				<Image src={logo} alt="" />

				<h1 className="mt-14 text-white text-5xl font-bold leading-tight">
					Crie seu próprio bolão da copa e compartilhe entre amigos!
				</h1>

				<div className="mt-10 flex items-center gap-2">
					<Image
						src={usersExample}
						alt="Usuários utilizam a plataforma"
						quality={100}
					/>
					<strong className="text-gray-100 text-xl">
						<span className="text-ignite-500">+{props.userCount}</span> pessoas
						estão já usando
					</strong>
				</div>

				<form onSubmit={createPool} className="mt-10 flex gap-2">
					<input
						className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-gray-100 text-sm"
						type="text"
						required
						placeholder="Qual o nome do seu bolão?"
						onChange={(event) => setPoolTitle(event.target.value)}
						value={poolTitle}
					/>
					<button
						className="px-6 py-4 rounded bg-yellow-500 text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
						type="submit"
					>
						Criar meu bolão
					</button>
				</form>

				<p className="mt-4 text-sm text-gray-300 leading-relaxed">
					Após criar seu bolão, você receberá um código único que poderá usar
					para convidar outras pessoas 🚀
				</p>

				<div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
					<div className="flex items-center gap-6">
						<Image src={CheckIcon} alt="" />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{props.poolCount}</span>
							<span>Bolões criados</span>
						</div>
					</div>
					<div className="w-px h-14 bg-gray-600" />
					<div className="flex items-center gap-6">
						<Image src={CheckIcon} alt="" />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{props.guessCount}</span>
							<span>Palpites enviados</span>
						</div>
					</div>
				</div>
			</main>
			<Image
				src={appPreview}
				alt="Dois celulares exibindo o app NLW Copa"
				quality={100}
			/>
		</div>
	);
}

export const getServerSideProps = async () => {
	const [userCountResponse, poolCountResponse, guessCountResponse] =
		await Promise.all([
			api.get('guesses/count'),
			api.get('pools/count'),
			api.get('users/count'),
		]);

	return {
		props: {
			userCount: userCountResponse.data.count,
			poolCount: poolCountResponse.data.count,
			guessCount: guessCountResponse.data.count,
		},
	};
};
