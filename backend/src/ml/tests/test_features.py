import unittest
import pandas as pd
import numpy as np
from src.feature_engineer import FeatureEngineer

class TestFeatures(unittest.TestCase):
    def setUp(self):
        self.df = pd.DataFrame({
            'close': np.random.normal(100, 5, 100),
            'volume': np.random.randint(1000, 5000, 100)
        })
        self.engineer = FeatureEngineer()

    def test_rsi_range(self):
        df = self.engineer.add_features(self.df)
        self.assertTrue((df['rsi'] >= 0).all() and (df['rsi'] <= 100).all())

    def test_sma_calculation(self):
        df = self.engineer.add_features(self.df)
        self.assertAlmostEqual(df['sma_20'].iloc[-1], self.df['close'].iloc[-20:].mean(), delta=0.01)

if __name__ == '__main__':
    unittest.main()