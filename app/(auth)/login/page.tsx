'use client';

import { useEffect, useState } from 'react'; //delete useEffect after testing
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { loginWithEmailPassword } from '@/actions/auth';
import { fetchTopK } from '@/actions/queries/query'; //delete after testing
import { Button, ButtonLink } from '@/components/Button';
import CustomLink from '@/components/CustomLink';
import { Textbox } from '@/components/Textbox';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  // TESTING HIERARCHICAL FILTER
  // -----------------------------
  useEffect(() => {
    const testHierarchicalFilter = async () => {
      try {
        const result = await fetchTopK(
          [
            0.003245466, -0.13506275, 0.101707876, 0.060479958, 0.0260059,
            0.047100917, -0.01697197, -0.054858226, 0.058937714, -0.024658974,
            -0.0019504484, -0.08487613, 0.012033737, 0.011476055, 0.011203916,
            0.033599094, 0.00803048, -0.08605542, -0.035979424, -0.02668734,
            -0.04775823, 0.086751916, -0.064244054, 0.008227673, -0.040886696,
            -0.0012477513, -0.044829883, 0.021098625, -0.107025884,
            -0.008826277, 0.010322569, 0.06300526, 0.0075779054, 0.024821607,
            0.059391525, 0.05966571, -0.026314396, -0.052306183, 0.025471117,
            -0.033779956, -0.003998188, 0.047594324, 0.0681956, 0.034145873,
            -0.044664215, -0.107776366, -0.046526253, -0.01777432, -0.027851816,
            -0.013955271, 0.0066438424, 0.028248513, 0.016148211, 0.05480908,
            -0.03283441, -0.012741804, -0.015792567, 0.05751349, -0.004558336,
            -0.057201736, 0.07411741, 0.012519504, -0.045802373, 0.006690027,
            -0.0076866983, -0.0063230763, 0.045318037, 0.06524549, 0.112179816,
            -0.02373501, -0.079569176, -0.00012152786, -0.038945705, 0.06782523,
            -0.01278481, -0.051946342, 0.029759873, -0.017058317, 0.040484216,
            0.04617117, 0.027236987, -0.067393765, -0.026915766, 0.0025942128,
            -0.05083461, -0.112203434, -0.03164588, 0.0012097026, 0.02149049,
            0.030123748, -0.076086774, 0.04847251, -0.014185802, -0.05445696,
            -0.035983168, -0.040266834, 0.011341381, 0.07316673, -0.064454295,
            0.09631427, 0.010273736, 0.054956272, 0.023510238, -0.04580491,
            0.030654646, 0.085010745, -0.035223167, 0.0828791, -0.07456247,
            -0.04915262, 0.003268643, 0.030114755, -0.027431762, 0.011279938,
            0.04902683, 0.07528703, 0.025864849, 0.00013977643, 0.1210465,
            0.08102629, -0.036114465, -0.006870454, -0.035931677, 0.024378968,
            -0.0068089534, 0.0596606, -0.047368646, 5.6837967e-34, 0.08243762,
            -0.043764815, 0.024971148, 0.066788025, 0.00093207706, 0.06982818,
            -0.09023515, 0.04155504, -0.06602874, -0.034542438, -0.008728726,
            0.06304607, -0.025297204, -0.024725638, -0.0375145, -0.051603485,
            -0.0021676824, -0.021449387, -0.048956268, 0.011310509, 0.026462637,
            -0.018847764, -0.064816676, 0.058447838, -0.0031082653,
            -0.025592603, 0.009925358, -0.07817183, 0.042089034, 0.009973224,
            -0.02755564, 0.10525687, 0.041299805, -0.08548462, 0.009373317,
            -0.019633891, -0.0154734235, -0.010273037, 0.0151722245,
            -0.07052545, -0.03183778, 0.043446746, -0.019804655, 0.0069044153,
            0.009748421, 0.007933954, 0.036717225, 0.008218233, -0.000682125,
            0.014982269, -0.118233256, -0.033971556, -0.14525242, 0.028609369,
            -0.031072637, 0.017789342, -0.024279408, -0.013505296, 0.03835686,
            -0.00607121, 0.074810855, 0.059001975, -0.015365369, -0.090719275,
            0.037304908, -0.018989556, 0.035923857, -0.058304854, -0.010398225,
            0.022979239, -0.027229857, 0.034672424, 0.06242462, 0.05611573,
            0.011884072, 0.03733421, 0.029876502, -0.05193492, -0.07538348,
            0.018488359, 0.045050856, 0.047307808, -0.016103234, 0.038056497,
            0.104885705, -0.07897274, 0.0300596, -0.10147474, 0.00813368,
            0.051298145, -0.0021441644, -0.0074205315, 0.08176862, -0.0642693,
            -0.031771395, -1.3342789e-33, 0.045802202, -0.057523612, 0.05059847,
            -0.08033037, 0.037849832, -0.07238925, -0.041666336, 0.05307991,
            -0.0074744653, 0.037704285, -0.08105139, 0.03226683, 0.13317284,
            0.07696689, -0.100433774, 0.029416729, 0.05987692, -0.0070651,
            -0.062072523, -0.059524022, -0.050042268, 0.040443495, -0.034711726,
            -0.013185134, 0.020395357, 0.015456001, 0.040323824, -0.005619196,
            -0.07726186, 0.027923167, -0.08569742, 0.07552538, -0.013669044,
            0.011869336, -0.11340897, 0.012525458, 0.028801234, -0.06629805,
            -0.03252433, -0.04761859, -0.04094753, -0.028305845, -0.017947452,
            -0.090597704, -0.0399058, 0.033394594, -0.020971645, 0.08005618,
            -0.045203, -0.038828537, 0.013917467, 0.0074369535, 0.06731587,
            -0.03309287, 0.084721215, 0.036036886, -0.061710443, -0.06570499,
            -0.04423808, 0.057562094, -0.05727182, 0.09350882, 0.017104428,
            -0.026267648, 0.0754589, -0.07854388, -0.038242236, 0.010155702,
            -0.085629396, 0.044995677, 0.06750148, -0.113848135, -0.065232515,
            -0.005455401, 0.05149526, -0.0075946646, -0.008206217, -0.019672643,
            -0.119575374, 0.039515827, 0.05036721, 0.0639073, 0.02179928,
            -0.046338353, 0.088080764, 0.07385829, 0.03433626, 0.06694862,
            0.029753678, -0.0013495072, -0.05619595, -0.026837464, -0.105213195,
            -0.06401276, -0.01734142, -4.1031857e-8, 0.0052539646, 0.0021216187,
            -0.037716154, 0.05673344, -0.0150723, 0.041325275, 0.055516284,
            0.043564014, 0.0006580144, 0.0025000365, -0.057708148, -0.043966148,
            0.059611373, -0.01584266, 0.088837616, 0.041389875, 0.008360183,
            -0.06032182, -0.033428717, -0.014277555, -0.00556763, 0.007712725,
            0.017552821, 0.072504774, 0.029795267, 0.0535975, 0.0020456421,
            0.039745856, -0.012016584, 0.045967266, -0.07152895, 0.048407264,
            -0.04750156, -0.01833618, -0.012218501, -0.067593515, -0.040525716,
            -0.069689125, -0.051868275, 0.026927011, -0.02984241, -0.024882926,
            0.02586421, 0.057105742, 0.042066887, 0.03932787, 0.09680251,
            0.02947463, -0.042537365, 0.084946714, -0.04258499, -0.025602715,
            0.055132378, 0.052152768, 0.11123738, 0.06054894, -0.011045496,
            0.080274835, -0.01720372, 0.02334949, 0.05575293, -0.031834275,
            -0.072909355, -0.025316536,
          ],
          3, // k value
          'lorem ipsum', // gender
          null, // veteran_status
          'Murder', // offense
          'lorem ipsum', // state, none for wyoming
        );
        console.log('Hierarchical filter result:', result);
      } catch (err) {
        console.error('Error testing hierarchical filter:', err);
      }
    };

    testHierarchicalFilter();
  }, []);
  // -----------------------------

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const router = useRouter();

  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async ({ email, password }: LoginForm) => {
    const { error } = await loginWithEmailPassword({
      email,
      password,
    });

    // handle errors
    if (error) {
      switch (error.code) {
        case 'email_address_invalid':
          setAuthError('Email address not supported.');
          break;
        case 'email_not_confirmed':
          setAuthError('Email not confirmed.');
          break;
        case 'invalid_credentials':
          setAuthError('Either email or password is incorrect.');
          break;
        default:
          setAuthError('An unexpected error occurred, please try again later.');
      }

      return;
    }

    setAuthError(null);
    router.push('/');
  };

  return (
    <form
      className="flex h-full w-full flex-col items-center justify-center"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <div className="flex w-106 flex-col gap-4 rounded-2xl bg-gray-1 p-8">
        <p className="text-3xl font-medium">Log in</p>

        {authError && <p className="py-2 text-error">{authError}</p>}

        <div className="flex flex-col">
          <div className="flex flex-col">
            {errors.root && <p className="text-error">{errors.root.message}</p>}

            {/* This is the Email title and textbox */}
            <div className="flex flex-col">
              <p className="text-base text-gray-9">Email</p>
              <Textbox
                type="email"
                placeholder="jamie@example.com"
                {...register('email', { required: true })}
              />
            </div>

            {/* This is the password title and textbox */}
            <div className="flex flex-col">
              <div className="flex flex-row justify-between pt-4">
                <p className="text-base text-gray-9">Password</p>
                <CustomLink
                  variant="secondary"
                  className="text-sm"
                  href="/forgot-password"
                >
                  Forgot password?
                </CustomLink>
              </div>

              <Textbox
                type="password"
                placeholder="Password"
                {...register('password', { required: true })}
              />
              {errors.password && (
                <p className="text-right text-error">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <Button variant="primary" className="mt-7" type="submit">
            Login
          </Button>
        </div>

        <div className="h-0.5 w-full border-t-2 border-gray-5" />

        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-medium text-gray-12">
            Don&#39;t have an account?
          </p>
          <ButtonLink variant="secondary" href="/sign-up">
            Sign Up
          </ButtonLink>
        </div>
      </div>
    </form>
  );
}
