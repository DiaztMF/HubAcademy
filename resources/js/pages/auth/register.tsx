import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="nisn">NISN</Label>
                                    <Input
                                        id="nisn"
                                        type="text"
                                        required
                                        maxLength={10}
                                        tabIndex={3}
                                        autoComplete="off"
                                        name="nisn"
                                        placeholder="10-digit NISN"
                                    />
                                    <InputError message={errors.nisn} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="class">Class</Label>
                                    <Select name="class">
                                        <SelectTrigger tabIndex={4}>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="X-A">X-A</SelectItem>
                                            <SelectItem value="X-B">X-B</SelectItem>
                                            <SelectItem value="XI-A">XI-A</SelectItem>
                                            <SelectItem value="XI-B">XI-B</SelectItem>
                                            <SelectItem value="XII-A">XII-A</SelectItem>
                                            <SelectItem value="XII-B">XII-B</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.class} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="major">Major</Label>
                                <Select name="major">
                                    <SelectTrigger tabIndex={5}>
                                        <SelectValue placeholder="Select major" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IPA">IPA</SelectItem>
                                        <SelectItem value="IPS">IPS</SelectItem>
                                        <SelectItem value="Bahasa">Bahasa</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.major} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={7}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={8}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={9}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
