'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { loginWithEmailPassword } from '@/actions/auth';
//delete useEffect after testing
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
        const k_value = 4;
        const gender = 'Female';
        const veteran_status = null;
        const offense = 'murder';
        const state = 'Florida';
        const result = await fetchTopK(
          [
            -0.008408222, -0.026134677, 0.0064639607, 0.003315295, -0.03395259,
            -0.011119512, 0.0302776, -0.06395323, 0.05609047, 0.016086504,
            -0.0076309773, -0.023309566, 0.015759373, -0.06922129, 0.0545921,
            -0.020706333, -0.029862022, -0.069093786, -0.002845913, 0.095766105,
            -0.06385914, 0.06019189, -0.0042166053, 0.0051289406, 0.010390179,
            -0.043354243, 0.016842034, 0.102432586, -0.0007039767, 0.0108426055,
            0.05514521, 0.027095858, -0.034171898, -0.0146518005, 0.05631374,
            0.027277315, 0.0005720704, 0.019590309, 0.031420693, 0.072440565,
            0.050677035, 0.070772514, 0.04459705, 0.028566545, -0.008507789,
            -0.11677709, -0.058762196, 0.061294075, -0.04047902, -0.13052009,
            0.006472623, 0.062639125, 0.02072409, 0.042372394, -0.040059455,
            0.05614375, -0.050892238, -0.0023960068, -0.064375095, -0.023601824,
            0.0398749, 0.028589582, 0.045589767, 0.043823276, -0.037576273,
            0.06556284, 0.02185997, -0.015031323, 0.011959955, -0.07542035,
            -0.054969102, -0.033757728, 0.0049843104, 0.015083091, -0.05161847,
            -0.05860084, 0.041504163, -0.10762928, 0.046591617, 0.035399377,
            0.0011993096, 0.00028088628, -0.01167419, 0.019168993,
            -0.0017749609, -0.023441413, 0.011414033, 0.0073000435, 0.05230225,
            -0.00048725423, -0.005808089, 0.11799621, -0.037060536,
            -0.049402975, -0.011067838, 0.00025317707, 0.120039344, 0.041736916,
            -0.019268233, 0.09283148, -0.07090353, 0.0062763155, 0.02823148,
            0.060772456, 0.046067897, 0.076485, -0.098489754, 0.08112756,
            -0.017515045, -0.09500619, 0.10541669, 0.013315685, -0.063487835,
            -0.046324033, 0.07037621, 0.05520827, 0.023022532, -0.02114129,
            0.012957985, 0.022585267, -0.07298941, 0.0347273, -0.008736225,
            0.04884679, 0.06391883, 0.018893998, 0.029149732, -5.84605e-34,
            -0.021572938, -0.052086957, 0.0075728805, -0.021158302, -0.06048395,
            -0.014177927, -0.08594743, -0.03030097, -0.040930618, -0.0039922283,
            0.043757584, 0.05842546, 0.0012317246, 0.016848857, -0.114116065,
            -0.008568047, -0.0334105, -0.043430645, -0.13150615, -0.05429597,
            -0.027848516, -0.1108761, -0.020705303, 0.07213301, -0.044993773,
            -0.043440577, 0.056531325, -0.0036595354, 0.104439326, 0.0011849641,
            -0.021419138, 0.05954684, 0.07221911, -0.013952651, 0.03643092,
            0.031698838, -0.08677248, -0.025807071, 0.0053494456, -0.036242418,
            -0.08122759, 0.07567424, 0.058526702, 0.008979346, 0.020745348,
            0.0020017717, 0.08538851, -0.04022554, -0.051429957, 0.004826709,
            -0.062701985, 0.040556192, -0.020657862, -0.016313912, -0.08576482,
            -0.013100563, -0.027019072, 0.06607383, 0.01776722, 0.061868906,
            -0.048893448, 0.033464517, -0.004979837, -0.0550707, -0.041308004,
            -0.038066883, 0.020270811, -0.0010091147, 0.059930857, -0.021788,
            0.10808646, 0.005386777, 0.013337804, 0.053727645, -0.014304204,
            0.01010548, 0.04822473, 0.019797368, -0.020250795, -0.023741907,
            0.043264754, 0.07707083, -0.095582455, 0.051182058, 0.12085755,
            -0.027484516, -0.033399124, -0.15195714, -0.022996664, 0.0225705,
            0.08940127, 0.081153154, 0.07941012, -0.09960192, -0.05429432,
            -1.0728611e-34, 0.06573876, -0.08362856, 0.055754084, -0.0589326,
            0.019760933, -0.086245716, -0.014830065, 0.044118404, 0.05467248,
            0.04512212, -0.08228678, 0.093937464, 0.0835807, -0.001334495,
            -0.10153746, -0.00968896, 0.0052823434, -0.0077396664, -0.053980615,
            -0.063910544, 0.0131397545, 0.0043567796, -0.04501777,
            -0.0064173033, 0.051177915, 0.02771326, 0.0008846025, 0.06152258,
            0.008005227, -0.078308895, 0.047540285, 0.110993154, -0.047381796,
            -0.020919278, -0.007407531, 0.010745649, 0.06950226, -0.042672567,
            0.034469634, -0.12010755, -0.009778243, -0.0035621661, 0.041920584,
            -0.023352599, -0.007281214, 0.04565964, 0.046999525, -0.0040788115,
            -0.04825044, -0.08369208, -0.08186741, -0.04623611, 0.014509851,
            0.030831227, 0.05131222, 0.05870601, -0.0454706, -0.08464252,
            -0.019649403, -0.014054471, 0.00989397, 0.014628719, 0.0129367355,
            0.036499612, 0.055839725, -0.074865244, -0.05423458, -0.00065817585,
            -0.11741874, 0.03564113, -0.020400738, -0.10182564, -0.09284364,
            -0.043952018, 0.01277457, -0.009381319, 0.06019777, 0.0067932135,
            -0.083539225, -0.015724305, 0.025974467, -0.024365405, 0.0033326794,
            -0.01267836, 0.01690386, 0.036452767, -0.03580915, 0.07939475,
            -0.009238116, 0.046231363, -0.0433577, -0.028252553, 0.077056564,
            -0.09456729, -0.051106494, -4.560559e-8, 0.02815134, 0.012360537,
            0.01597746, 0.03826737, -0.03687771, 0.045748625, 0.012206703,
            0.0027682427, -0.011898367, -0.037236914, -0.0338489, 0.03683318,
            0.064821854, -0.006483922, 0.04968896, 0.047587976, -0.057669904,
            -0.09932173, -0.02395406, -0.050559808, -0.02522005, -0.013872484,
            -0.00724996, 0.059090037, 0.060856372, 0.011736866, -0.014023781,
            0.02769482, -0.056225732, 0.0033232456, -0.061692968, 0.05251905,
            -0.11461026, 0.071059674, 0.04822816, -0.073277876, -0.09034771,
            -0.013503616, -0.013441601, 0.025407583, 0.006941445, 0.014771374,
            0.021871325, -0.006748289, -0.04277164, 0.008389617, -0.019488212,
            0.061233606, -0.021790963, 0.04038342, -0.023042163, -0.009716468,
            0.033485025, 0.007985806, 0.04344573, 0.040985823, 0.037118446,
            0.052802023, 0.04753865, -0.045925803, 0.07939196, -0.014422581,
            -0.036035795, -0.06111028,
          ],
          k_value,
          gender,
          veteran_status,
          offense,
          state,
        );
        console.log(
          'Passed: ',
          k_value,
          gender,
          veteran_status,
          offense,
          state,
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
